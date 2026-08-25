// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Script, console} from "forge-std/Script.sol";
import {LiquidToken} from "@luxfi/standard/liquid/LiquidToken.sol";

/// @title Grants — the permissions and float a market needs to actually run.
/// @notice Two things, both owned by the synthetic rather than by the market,
/// which is why this runs under the standard's pragma and not the protocol's.
///
/// First, mint rights: a market issues debt by calling `mint` on its synthetic,
/// and LiquidToken only accepts that from a whitelisted address. Without it
/// every borrow reverts as an opaque ERC20CallFailed.
///
/// Second, the fee vault's float. When a liquidation seizes less than the debt,
/// the liquidator is paid out of that vault instead, and the vault reports its
/// balance as `totalDeposits()` — so an empty one turns every such liquidation
/// into a revert and leaves bad debt sitting on the books.
contract Grants is Script {
    string[3] assets = ["LUX", "ETH", "BTC"];

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        uint256 float_ = vm.envOr("FEE_VAULT_FLOAT", uint256(10_000 ether));
        string memory d = vm.readFile(string.concat("./deploy/", vm.toString(block.chainid), ".json"));

        vm.startBroadcast(pk);
        for (uint256 i = 0; i < assets.length; i++) {
            LiquidToken synthetic = LiquidToken(vm.parseJsonAddress(d, string.concat(".markets.", assets[i], ".synthetic")));
            synthetic.setWhitelist(vm.parseJsonAddress(d, string.concat(".markets.", assets[i], ".liquid")), true);

            synthetic.setWhitelist(deployer, true);
            synthetic.mint(vm.parseJsonAddress(d, string.concat(".markets.", assets[i], ".feeVault")), float_);
            synthetic.setWhitelist(deployer, false);

            console.log(assets[i], "market may mint", address(synthetic));
        }
        vm.stopBroadcast();
    }
}
