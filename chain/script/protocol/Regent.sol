// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Liquid} from "@luxfi/liquid/Liquid.sol";
import {LiquidPosition} from "@luxfi/liquid/LiquidPosition.sol";
import {LiquidTransmuter} from "@luxfi/liquid/LiquidTransmuter.sol";
import {LiquidTokenVault} from "@luxfi/liquid/LiquidTokenVault.sol";
import {LiquidInitializationParams} from "@luxfi/liquid/interfaces/ILiquid.sol";
import {ILiquidTransmuter} from "@luxfi/liquid/interfaces/ILiquidTransmuter.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/// @title Regent — holds a market's authority only long enough to build it.
/// @notice A market cannot be initialized already finished. Its position NFT and
/// its fee vault both need the market's own address, so they exist only after
/// the market does, and both are set by the admin. Whoever builds the market is
/// therefore its admin for as long as the build takes.
///
/// Handing that admin on afterwards does not end it: the engine and the
/// transmuter both transfer authority by nomination, and the nominee has to
/// accept. A deploy key that nominates a multisig stays admin until the multisig
/// signs, which on a market holding customer collateral is a hot key with the
/// power to swap the price feed.
///
/// So the builder is this contract, and it is built and spent in one
/// transaction. Everything it does happens in its constructor; it declares no
/// other function, so once that transaction returns there is no call that
/// reaches it and no call it can make. The authority it holds is real and
/// inert, and it holds it only until `owner` accepts the nomination it leaves
/// behind. The account that deployed it has none of it at any point.
contract Regent {
    Liquid public immutable liquid;
    LiquidTransmuter public immutable transmuter;
    LiquidPosition public immutable position;
    LiquidTokenVault public immutable vault;

    constructor(
        address owner,
        address implementation,
        LiquidInitializationParams memory params,
        ILiquidTransmuter.TransmuterInitializationParams memory transmuterParams
    ) {
        transmuter = new LiquidTransmuter(transmuterParams);

        // Filled in here rather than taken from the caller: the market must be
        // born under this contract's authority, and pointed at the transmuter
        // that came with it, for either to be true at all.
        params.admin = address(this);
        params.transmuter = address(transmuter);

        liquid = Liquid(address(new ERC1967Proxy(implementation, abi.encodeCall(Liquid.initialize, (params)))));

        position = new LiquidPosition(address(liquid));
        liquid.setLiquidPositionNFT(address(position));

        // Liquidations that outrun a position's collateral pay the liquidator
        // from this vault, in the underlying — which setLiquidFeeVault checks,
        // so the vault holds the synthetic. It is authorized to `owner`, never
        // to whoever ran the deploy.
        vault = new LiquidTokenVault(params.underlyingToken, address(liquid), owner);
        liquid.setLiquidFeeVault(address(vault));

        // The transmuter is the other half of the loan: it holds repaid
        // collateral and lets synthetic holders redeem against it. Without the
        // back reference and a deposit cap it is deployed and inert.
        transmuter.setLiquid(address(liquid));
        transmuter.setDepositCap(params.depositCap);

        liquid.setPendingAdmin(owner);
        transmuter.setPendingAdmin(owner);
    }
}
