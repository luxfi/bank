// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Script, console} from "forge-std/Script.sol";
import {WLUX} from "@luxfi/standard/tokens/WLUX.sol";
import {BridgedETH} from "@luxfi/standard/bridge/collateral/ETH.sol";
import {BridgedBTC} from "@luxfi/standard/bridge/collateral/BTC.sol";
import {LiquidToken} from "@luxfi/standard/liquid/LiquidToken.sol";

/// @title Tokens — the asset layer, deployed per chain.
/// @notice Two tiers, and they are not interchangeable.
///
/// Collateral is the bridged tier: LUX is the chain's own coin so it is not
/// deployed, WLUX is its ERC-20 wrapper, and BridgedETH and BridgedBTC are what
/// a bridge mints when ETH or BTC arrives. Their symbols are plain "ETH" and
/// "BTC", and BridgedBTC keeps Bitcoin's 8 decimals rather than padding to 18.
///
/// Debt is the liquid tier — LETH, LBTC, LLUX — one per collateral, and this is
/// where the safety argument lives. A 90% ceiling is only sane when the debt is
/// denominated in the same asset as the collateral, because then a price move
/// changes both sides at once and cannot move the ratio between them. Borrow a
/// dollar-denominated synthetic against volatile collateral at 90% and an
/// ordinary drawdown takes the position out. So each market gets its own
/// like-kind synthetic and there is no shared dollar debt token.
///
/// The liquid tier is deployed from LiquidToken rather than from the concrete
/// LiquidETH/LiquidBTC in liquid/tokens/. Those extend LRC20B, which offers
/// `burn(address,uint256)` and no `burnFrom` — while the protocol repays debt
/// through `burnFrom(address,uint256)`. LiquidToken, which the standard already
/// documents as the base for exactly these tokens, implements the surface the
/// protocol actually calls; the LRC20B-based ones would take deposits and never
/// let the debt be repaid.
contract Tokens is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        // Native coin the treasury wraps, so a market has ERC-20 collateral.
        uint256 wrap = vm.envOr("WRAP_NATIVE", uint256(1_000 ether));
        // Bridged float the treasury holds, standing in for what a bridge mints.
        uint256 bridged = vm.envOr("BRIDGE_FLOAT", uint256(1_000 ether));

        vm.startBroadcast(pk);

        WLUX wlux = new WLUX();
        wlux.deposit{value: wrap}();

        BridgedETH eth = new BridgedETH();
        eth.mint(deployer, bridged);

        BridgedBTC btc = new BridgedBTC();
        btc.mint(deployer, bridged / 1e10); // 8 decimals, not 18

        // Flash fee at the floor the token enforces (1bp). The markets never
        // flash-mint; this only satisfies the constructor's minimum.
        LiquidToken llux = new LiquidToken("Liquid LUX", "LLUX", 1);
        LiquidToken leth = new LiquidToken("Liquid ETH", "LETH", 1);
        LiquidToken lbtc = new LiquidToken("Liquid BTC", "LBTC", 1);

        vm.stopBroadcast();

        string memory j = "tokens";
        vm.serializeAddress(j, "WLUX", address(wlux));
        vm.serializeAddress(j, "ETH", address(eth));
        vm.serializeAddress(j, "BTC", address(btc));
        vm.serializeAddress(j, "LLUX", address(llux));
        vm.serializeAddress(j, "LETH", address(leth));
        string memory out = vm.serializeAddress(j, "LBTC", address(lbtc));
        vm.writeJson(out, string.concat("./out/tokens.", vm.toString(block.chainid), ".json"));

        console.log("chain", block.chainid);
        console.log("WLUX", address(wlux));
        console.log("ETH ", address(eth));
        console.log("BTC ", address(btc));
    }
}
