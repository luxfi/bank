// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Liquid} from "@luxfi/liquid/Liquid.sol";
import {LiquidPosition} from "@luxfi/liquid/LiquidPosition.sol";
import {LiquidTransmuter} from "@luxfi/liquid/LiquidTransmuter.sol";
import {LiquidTokenVault} from "@luxfi/liquid/LiquidTokenVault.sol";
import {SecurityTokenAdapter} from "@luxfi/liquid/adapters/SecurityTokenAdapter.sol";
import {LiquidInitializationParams} from "@luxfi/liquid/interfaces/ILiquid.sol";
import {ILiquidTransmuter} from "@luxfi/liquid/interfaces/ILiquidTransmuter.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/// @title Protocol — one self-repaying-loan market per collateral asset.
/// @notice Each market is an independent `Liquid` holding one collateral token
/// and issuing that collateral's own synthetic against it. Borrowing past the
/// LTV ceiling reverts in `_addDebt`, on chain, with nothing off chain involved.
///
/// Every market here is like-kind: `yieldToken` is the collateral, and both
/// `debtToken` and `underlyingToken` are the synthetic denominated in that same
/// asset. The adapter therefore prices the collateral in its own unit, starting
/// at parity and rising only as yield accrues — which is what makes 90% a safe
/// ceiling, since a price move cannot change the ratio between the two sides.
///
/// The contract does not enforce this. `Liquid.initialize` takes debtToken,
/// underlyingToken and yieldToken as three unrelated addresses and trusts the
/// adapter's `price()`, so a dollar-denominated debt against volatile
/// collateral is constructible and would be liquidated by ordinary drawdown.
/// The invariant lives in this deployment, not in the protocol.
contract Protocol is Script {
    /// Collateral / debt ratio in 1e18. A mint that would push a position below
    /// it reverts, so LTV = 1e18 / this. 1e36/9e17 is 90% to the last wei — the
    /// truncated 1.1111e18 the protocol repo's local script uses is really
    /// 90.0009%, which is not a ceiling anyone should be quoting.
    uint256 constant MIN_COLLATERALIZATION = uint256(1e36) / 9e17;

    /// The level below which liquidation stops restoring margin and writes the
    /// whole position off as bad debt. It has to sit BELOW the borrow ceiling:
    /// a fully drawn protocol sits at exactly MIN_COLLATERALIZATION, so setting
    /// this above that (as the protocol repo's scripts do, at 1.15e18) puts a
    /// healthy protocol permanently in the bad-debt branch and every
    /// liquidation takes it. Note `setGlobalMinimumCollateralization` enforces
    /// the opposite ordering — the setter's invariant contradicts the way the
    /// value is used, so this can only be set through `initialize`.
    uint256 constant GLOBAL_MIN_COLLATERALIZATION = 1.05e18;

    /// Collateralization at which a position becomes liquidatable, leaving a
    /// band between "cannot borrow more" and "can be seized".
    uint256 constant LIQUIDATION_BOUND = 1.05e18;
    uint256 constant BLOCKS_PER_YEAR = 15_768_000;

    /// How long the collateral's price may go unrefreshed before the adapter
    /// treats it as stale. Every conversion in the protocol routes through
    /// `price()`, so once this lapses deposits, borrows and balance reads all
    /// revert. It cannot be uint256 max — `price()` computes
    /// `navTimestamp + navStalenessMax`, which then overflows and panics.
    uint256 constant NAV_WINDOW = 3650 days;

    /// Opening price of one collateral token in its own synthetic. Parity: the
    /// collateral has accrued no yield yet. It rises from here, and that rise
    /// is what repays the loan.
    uint256 constant PARITY = 1e18;

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
        for (uint256 i = 0; i < markets.length; i++) {
            out = vm.serializeString("markets", markets[i].asset, _record(markets[i], _deploy(pk, vm.addr(pk), markets[i])));
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

    /// Deploys and wires one market.
    function _deploy(uint256 pk, address deployer, Market memory m) internal returns (Deployed memory d) {
        vm.startBroadcast(pk);

        SecurityTokenAdapter adapter = new SecurityTokenAdapter(m.collateral, m.asset, "", "", "crypto", PARITY);
        // Until a yield oracle holds ORACLE_ROLE and refreshes the NAV, the
        // window has to outlast the deployment.
        adapter.setNavStalenessMax(NAV_WINDOW);

        LiquidTransmuter transmuter = new LiquidTransmuter(
            ILiquidTransmuter.TransmuterInitializationParams({
                syntheticToken: m.synthetic,
                feeReceiver: deployer,
                timeToTransmute: TIME_TO_TRANSMUTE,
                transmutationFee: TRANSMUTATION_FEE,
                exitFee: EXIT_FEE,
                graphSize: GRAPH_SIZE
            })
        );

        // Liquid's constructor is `constructor() initializer {}`, so the
        // implementation burns its own initializer slot and only a proxy can be
        // initialized. The init call rides in the proxy constructor rather than
        // following as a second transaction: initialize is unpermissioned, so
        // empty init data leaves a window for anyone to claim admin of the market.
        LiquidInitializationParams memory params = LiquidInitializationParams({
            admin: deployer,
            debtToken: m.synthetic,
            underlyingToken: m.synthetic,
            yieldToken: m.collateral,
            depositCap: type(uint128).max,
            blocksPerYear: BLOCKS_PER_YEAR,
            minimumCollateralization: MIN_COLLATERALIZATION,
            globalMinimumCollateralization: GLOBAL_MIN_COLLATERALIZATION,
            collateralizationLowerBound: LIQUIDATION_BOUND,
            tokenAdapter: address(adapter),
            transmuter: address(transmuter),
            protocolFee: PROTOCOL_FEE,
            protocolFeeReceiver: deployer,
            liquidatorFee: LIQUIDATOR_FEE,
            repaymentFee: REPAYMENT_FEE
        });
        ERC1967Proxy proxy = new ERC1967Proxy(address(new Liquid()), abi.encodeCall(Liquid.initialize, (params)));
        Liquid liquid = Liquid(address(proxy));

        LiquidPosition position = new LiquidPosition(address(liquid));
        liquid.setLiquidPositionNFT(address(position));

        // The transmuter is the other half of the loan: it holds repaid
        // collateral and lets synthetic holders redeem against it. Without the
        // back reference and a deposit cap it is deployed and inert.
        transmuter.setLiquid(address(liquid));
        transmuter.setDepositCap(type(uint128).max);

        // Liquidations that outrun a position's collateral pay the liquidator
        // from this vault, in the underlying — which setLiquidFeeVault checks,
        // so the vault holds the synthetic.
        LiquidTokenVault fees = new LiquidTokenVault(m.synthetic, address(liquid), deployer);
        fees.setAuthorization(address(liquid), true);
        liquid.setLiquidFeeVault(address(fees));

        vm.stopBroadcast();

        console.log(m.asset, "market", address(liquid));

        d.liquid = address(liquid);
        d.adapter = address(adapter);
        d.transmuter = address(transmuter);
        d.position = address(position);
        d.feeVault = address(fees);
    }
}
