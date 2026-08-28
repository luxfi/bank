// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Liquid} from "@luxfi/liquid/Liquid.sol";
import {LiquidTokenVault} from "@luxfi/liquid/LiquidTokenVault.sol";
import {LiquidInitializationParams} from "@luxfi/liquid/interfaces/ILiquid.sol";
import {ILiquidTransmuter} from "@luxfi/liquid/interfaces/ILiquidTransmuter.sol";
import {Index} from "./Index.sol";
import {Regent} from "./Regent.sol";

/// @title Protocol — one self-repaying-loan market per collateral asset.
/// @notice Each market is an independent `Liquid` holding one collateral token
/// and issuing that collateral's own synthetic against it. Borrowing past the
/// LTV ceiling reverts in `_addDebt`, on chain, with nothing off chain involved.
///
/// Every market here is like-kind: `yieldToken` is the collateral, and both
/// `debtToken` and `underlyingToken` are the synthetic denominated in that same
/// asset. {Index} therefore prices the collateral in its own unit, starting at
/// parity and rising only as yield accrues — which is what makes 90% a safe
/// ceiling, since a price move cannot change the ratio between the two sides.
///
/// The engine values collateral against debt with a decimals scalar and a price,
/// and takes debtToken, underlyingToken and yieldToken as three unrelated
/// addresses. A dollar-denominated debt against volatile collateral is
/// constructible and would be liquidated by ordinary drawdown. The invariant
/// lives in this deployment, not in the protocol.
///
/// Nobody who runs this ends up able to move anyone's money. The deploy key
/// holds nothing when it returns: every market is born under a {Regent} that is
/// spent in the transaction that creates it, {Index} answers to an oracle named
/// in the environment, and the fees and the vault are the owner's. {_audit}
/// re-reads all of that off the chain and fails the run if any of it is untrue.
contract Protocol is Script {
    /// Collateral / debt ratio in 1e18. A mint that would push a position below
    /// it reverts, so LTV = 1e18 / this. 1e36/9e17 is 90% to the last wei — the
    /// truncated 1.1111e18 the protocol repo's local script uses is really
    /// 90.0009%, which is not a ceiling anyone should be quoting.
    uint256 constant MIN_COLLATERALIZATION = uint256(1e36) / 9e17;

    /// The level below which liquidation stops restoring margin and writes the
    /// whole position off as bad debt. It has to sit BELOW the borrow ceiling: a
    /// fully drawn protocol sits at exactly MIN_COLLATERALIZATION, so setting
    /// this above that (as the protocol repo's scripts do, at 1.15e18) puts a
    /// healthy protocol permanently in the bad-debt branch and every liquidation
    /// takes it.
    uint256 constant GLOBAL_MIN_COLLATERALIZATION = 1.05e18;

    /// Collateralization at which a position becomes liquidatable, leaving a
    /// band between "cannot borrow more" and "can be seized".
    uint256 constant LIQUIDATION_BOUND = 1.05e18;
    uint256 constant BLOCKS_PER_YEAR = 15_768_000;

    /// The rate the collateral earns, and so the rate everything that limits the
    /// oracle is calibrated against. Twenty percent a year is a generous read of
    /// what a bridged staking asset does; whatever is named above what the
    /// collateral really earns is room a compromised oracle works in for free.
    ///
    /// Written once and divided two ways below, because the two limits have to
    /// agree. A ceiling on the write side and a clamp on the read side derived
    /// from separate numbers is two policies, and the looser one is the policy.
    uint256 constant YIELD_CEILING = 0.2e18;

    /// How far the engine will follow the adapter in one block, as a fraction of
    /// the price in 1e18. It admits `this * blocks elapsed`, so zero pins the
    /// price where it was initialized and no yield ever reaches a borrower.
    ///
    /// Expressing it per block is what made the old value wrong: 1 BPS a block
    /// reads tight and is nearly eight thousand times a 20% year. Deriving it
    /// from the annual rate puts the number where it can be checked against the
    /// collateral.
    uint256 constant MAX_PRICE_DEVIATION = YIELD_CEILING / BLOCKS_PER_YEAR;

    /// Transmuter fees divide by BPS, so they are basis points — 50 = 0.5%
    /// transmutation, 200 = 2% exit. Writing them as 1e18 fixed point (as the
    /// protocol repo's local script does) inflates them by 1e14 and leaves
    /// redemptions unclaimable.
    uint256 constant TRANSMUTATION_FEE = 50;
    uint256 constant EXIT_FEE = 200;
    uint256 constant TIME_TO_TRANSMUTE = 45 days;
    uint256 constant GRAPH_SIZE = 1000;

    uint256 constant PROTOCOL_FEE = 1000; // 10% of repayments, BPS
    uint256 constant LIQUIDATOR_FEE = 500; // 5%, BPS
    uint256 constant REPAYMENT_FEE = 100; // 1%, BPS

    struct Market {
        string asset; // the bank's asset symbol for this collateral
        address collateral;
        address synthetic; // like-kind: same asset as the collateral
    }

    /// The addresses one market is made of.
    struct Deployed {
        address liquid;
        address adapter;
        address transmuter;
        address position;
        address feeVault;
    }

    function run() external {
        string memory t = vm.readFile(string.concat("./out/tokens.", vm.toString(block.chainid), ".json"));
        string memory root = "deploy";
        vm.serializeUint(root, "chainId", block.chainid);
        vm.serializeUint(root, "maxLtvBps", uint256(1e22) / MIN_COLLATERALIZATION);
        vm.serializeString(root, "tokens", t);
        vm.writeJson(
            vm.serializeString(root, "markets", _all(t)),
            string.concat("./deploy/", vm.toString(block.chainid), ".json")
        );
    }

    /// Deploys every market and returns their combined JSON.
    function _all(string memory t) internal returns (string memory out) {
        // Collateral is the bridged tier, debt the liquid tier of the same asset.
        Market[3] memory markets = [
            Market("LUX", vm.parseJsonAddress(t, ".WLUX"), vm.parseJsonAddress(t, ".LLUX")),
            Market("ETH", vm.parseJsonAddress(t, ".ETH"), vm.parseJsonAddress(t, ".LETH")),
            Market("BTC", vm.parseJsonAddress(t, ".BTC"), vm.parseJsonAddress(t, ".LBTC"))
        ];
        uint256 pk = vm.envUint("PRIVATE_KEY");

        // The engine holds no state of its own — its constructor burns the
        // initializer so only a proxy can be brought to life — so the three
        // markets share one copy of it.
        vm.broadcast(pk);
        address engine = address(new Liquid());

        for (uint256 i = 0; i < markets.length; i++) {
            out = vm.serializeString("markets", markets[i].asset, _record(markets[i], _deploy(pk, engine, markets[i])));
        }
    }

    /// Serializes one market's addresses into a JSON fragment.
    function _record(Market memory m, Deployed memory d) internal returns (string memory) {
        string memory j = string.concat("market.", m.asset);
        vm.serializeAddress(j, "collateral", m.collateral);
        vm.serializeAddress(j, "synthetic", m.synthetic);
        vm.serializeAddress(j, "adapter", d.adapter);
        vm.serializeAddress(j, "transmuter", d.transmuter);
        vm.serializeAddress(j, "position", d.position);
        vm.serializeAddress(j, "feeVault", d.feeVault);
        return vm.serializeAddress(j, "liquid", d.liquid);
    }

    /// The terms every market is born on.
    ///
    /// Separated from the broadcast so that a test can drive the market this
    /// deploys rather than one that merely resembles it. A second copy of these
    /// numbers written out in a test proves only that the copy is self
    /// consistent.
    function terms(Market memory m, address index, address owner) public pure returns (LiquidInitializationParams memory) {
        return LiquidInitializationParams({
            admin: address(0), // the Regent's own address, set inside it
            debtToken: m.synthetic,
            underlyingToken: m.synthetic,
            yieldToken: m.collateral,
            depositCap: type(uint128).max,
            blocksPerYear: BLOCKS_PER_YEAR,
            minimumCollateralization: MIN_COLLATERALIZATION,
            globalMinimumCollateralization: GLOBAL_MIN_COLLATERALIZATION,
            collateralizationLowerBound: LIQUIDATION_BOUND,
            tokenAdapter: index,
            maxPriceDeviation: MAX_PRICE_DEVIATION,
            transmuter: address(0), // likewise the transmuter it deploys
            protocolFee: PROTOCOL_FEE,
            protocolFeeReceiver: owner,
            liquidatorFee: LIQUIDATOR_FEE,
            repaymentFee: REPAYMENT_FEE
        });
    }

    /// The terms the transmuter is born on. Split from {terms} for the same reason.
    function redemptionTerms(Market memory m, address owner) public pure returns (ILiquidTransmuter.TransmuterInitializationParams memory) {
        return ILiquidTransmuter.TransmuterInitializationParams({
            syntheticToken: m.synthetic,
            feeReceiver: owner,
            timeToTransmute: TIME_TO_TRANSMUTE,
            transmutationFee: TRANSMUTATION_FEE,
            exitFee: EXIT_FEE,
            graphSize: GRAPH_SIZE
        });
    }

    /// Deploys one market and hands it over, in two transactions.
    function _deploy(uint256 pk, address engine, Market memory m) internal returns (Deployed memory d) {
        address owner = vm.envAddress("OWNER");
        address oracle = vm.envAddress("ORACLE");

        vm.startBroadcast(pk);

        Index index = new Index(m.collateral, m.synthetic, oracle, YIELD_CEILING);
        Regent regent = new Regent(owner, engine, terms(m, address(index), owner), redemptionTerms(m, owner));

        vm.stopBroadcast();

        d.liquid = address(regent.liquid());
        d.adapter = address(index);
        d.transmuter = address(regent.transmuter());
        d.position = address(regent.position());
        d.feeVault = address(regent.vault());

        _audit(vm.addr(pk), owner, oracle, address(regent), d);

        console.log(m.asset, "market", d.liquid);
    }

    /// Reads back who ended up holding this market, and refuses a deploy that
    /// left the deploy key able to re-price it, freeze it, or take its fees.
    function _audit(address deployer, address owner, address oracle, address regent, Deployed memory d) internal view {
        require(owner != deployer, "owner is the deploy key");
        require(oracle != deployer, "oracle is the deploy key");

        Liquid liquid = Liquid(d.liquid);
        require(liquid.admin() == regent, "market admin is not the regent");
        require(liquid.pendingAdmin() == owner, "market is not nominated to the owner");
        require(!liquid.guardians(deployer), "deploy key can pause the market");
        require(liquid.protocolFeeReceiver() == owner, "market fees do not go to the owner");

        require(liquid.tokenAdapter() == d.adapter, "market is not reading its own index");
        require(liquid.maxPriceDeviation() == MAX_PRICE_DEVIATION, "price rate limit was not applied");
        require(Index(d.adapter).oracle() == oracle, "index answers to someone other than the oracle");
        require(Index(d.adapter).ceiling() == YIELD_CEILING, "index takes any number the oracle names");

        // The pause is the fast answer to a bad price; the rate limits only buy
        // the time to reach for it. A market that takes deposits with nobody
        // holding that lever is a market nobody can stop.
        require(liquid.guardians(owner), "nobody can pause this market");

        require(liquid.liquidPositionNFT() == d.position, "market has no position NFT");
        require(liquid.liquidFeeVault() == d.feeVault, "market has no fee vault");

        LiquidTokenVault vault = LiquidTokenVault(d.feeVault);
        require(vault.owner() == owner, "fee vault is not the owner's");
        require(!vault.authorized(deployer), "deploy key can drain the fee vault");

        ILiquidTransmuter transmuter = ILiquidTransmuter(d.transmuter);
        require(transmuter.admin() == regent, "transmuter admin is not the regent");
        require(transmuter.pendingAdmin() == owner, "transmuter is not nominated to the owner");
        require(transmuter.protocolFeeReceiver() == owner, "transmuter fees do not go to the owner");
        require(address(transmuter.liquid()) == d.liquid, "transmuter is not bound to the market");
    }
}
