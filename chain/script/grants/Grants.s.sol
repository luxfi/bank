// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Script, console} from "forge-std/Script.sol";
import {LiquidToken} from "@luxfi/standard/liquid/LiquidToken.sol";

/// @title Grants — mint rights for each market, and the deploy key's last act.
/// @notice A market issues debt by calling `mint` on its synthetic, and
/// LiquidToken only accepts that from a whitelisted address. Without it every
/// borrow reverts as an opaque ERC20CallFailed. That whitelist is the synthetic's
/// to keep, not the market's, which is why this runs under the standard's pragma
/// and not the protocol's — and why it runs last, after Protocol has produced the
/// market addresses to point at.
///
/// Then the synthetic goes to `OWNER` and the deploy key gives up everything: the
/// right to whitelist a minter, the right to pause one, and the flash-mint fees
/// its constructor pointed at whoever deployed it. Each market is the only
/// account left that can bring its own synthetic into existence, and each
/// synthetic can only be brought into existence against debt.
///
/// Nothing is minted here. Doing so would put synthetic into circulation that
/// `totalSyntheticsIssued` never counted, and the transmuter decrements that
/// figure as holders redeem — so a supply the engine does not know about is one
/// the engine's own arithmetic underflows on. The liquidation bonus the fee vault
/// pays is a courtesy the engine skips when the vault is empty, not a
/// precondition; the owner funds it from real synthetic through the vault's own
/// `deposit`.
contract Grants is Script {
    string[3] assets = ["LUX", "ETH", "BTC"];

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        address owner = vm.envAddress("OWNER");
        require(owner != deployer, "owner is the deploy key");

        string memory d = vm.readFile(string.concat("./deploy/", vm.toString(block.chainid), ".json"));

        for (uint256 i = 0; i < assets.length; i++) {
            LiquidToken synthetic = LiquidToken(vm.parseJsonAddress(d, string.concat(".markets.", assets[i], ".synthetic")));
            address market = vm.parseJsonAddress(d, string.concat(".markets.", assets[i], ".liquid"));

            vm.startBroadcast(pk);
            synthetic.setWhitelist(market, true);
            synthetic.setFeeRecipient(owner);
            synthetic.grantRole(synthetic.ADMIN_ROLE(), owner);
            synthetic.grantRole(synthetic.SENTINEL_ROLE(), owner);
            synthetic.revokeRole(synthetic.SENTINEL_ROLE(), deployer);
            synthetic.revokeRole(synthetic.ADMIN_ROLE(), deployer);
            vm.stopBroadcast();

            _audit(synthetic, market, deployer, owner);
            console.log(assets[i], "market may mint", address(synthetic));
        }
    }

    /// Reads back who can mint this synthetic, and refuses a deploy that left
    /// the deploy key able to.
    function _audit(LiquidToken synthetic, address market, address deployer, address owner) internal view {
        require(synthetic.whitelisted(market), "market cannot mint its own synthetic");
        require(!synthetic.whitelisted(deployer), "deploy key can mint the synthetic");
        require(!synthetic.hasRole(synthetic.ADMIN_ROLE(), deployer), "deploy key can whitelist a minter");
        require(!synthetic.hasRole(synthetic.SENTINEL_ROLE(), deployer), "deploy key can pause the market's minting");
        require(synthetic.hasRole(synthetic.ADMIN_ROLE(), owner), "owner cannot administer the synthetic");
        require(synthetic.hasRole(synthetic.SENTINEL_ROLE(), owner), "owner cannot pause a compromised minter");
        require(synthetic.feeRecipient() == owner, "synthetic fees do not go to the owner");
    }
}
