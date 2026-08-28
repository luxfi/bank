// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ITokenAdapter} from "@luxfi/liquid/interfaces/ITokenAdapter.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @title Index — what one whole unit of collateral is worth in its own synthetic.
/// @notice The price feed of a like-kind market, and the only contract this
/// project defines that a user's money touches.
///
/// Neither adapter in the protocol repo can describe this market. The engine
/// binds an adapter only if it reports the market's own pair, and
/// `SecurityTokenAdapter` assigns one address to both halves of that pair, so it
/// can only ever describe a token priced in itself. `EulerUSDCAdapter` takes the
/// two apart but reads its price out of an ERC-4626 vault, which bridged ETH and
/// wrapped LUX are not. What is missing upstream is small enough to be exactly
/// this file.
///
/// The number reported is a yield index: it opens at parity — one collateral
/// token buys one synthetic — and rises as the collateral earns. That rise is
/// the whole product. A borrower's debt is denominated in the synthetic, the
/// collateral appreciates against it, and the loan pays itself down.
///
/// The index cannot fall, and that is a property of the market rather than a
/// courtesy to borrowers. Both sides of a like-kind position are the same asset,
/// so a collapse in the collateral's external price takes the synthetic with it
/// and leaves the ratio between them untouched. Only accrued yield moves that
/// ratio, and yield only accumulates. Nothing here can therefore make a position
/// liquidatable — the oracle's entire power is to hand borrowers room they have
/// earned, and the engine rate-limits even that.
///
/// There is no staleness window and no halt. A stale index under-reports what
/// the collateral has earned, which costs the borrower and protects the
/// protocol; reverting instead would freeze deposits, repayments and
/// liquidations at once, since every conversion in the engine reads this price.
contract Index is ITokenAdapter {
    string public constant version = "1.0.0";

    /// The yield token: the collateral this market takes.
    address public immutable token;

    /// The unit the index is quoted in: this market's synthetic.
    address public immutable underlyingToken;

    /// The only account that may advance the index.
    address public immutable oracle;

    /// The most the index may gain in a year, as a fraction of itself in 1e18.
    ///
    /// The collateral earns at some rate, and everything the oracle can name
    /// above that rate is room a compromised key works in. The engine keeps its
    /// own limit on the read side, but an engine is the only thing standing
    /// between a stolen key and an arbitrary price if the write side takes any
    /// number at all, and a single line is not a line.
    ///
    /// The two are deliberately unalike. The engine counts blocks and clamps in
    /// silence, so that a moving price never stops deposits or liquidations.
    /// This counts seconds and refuses, so that a report nobody could have
    /// earned leaves a record and the last good index standing. A mistake in
    /// either the block time or the clamp still leaves the other holding.
    uint256 public immutable ceiling;

    /// Synthetic units per whole collateral token.
    uint256 public price;

    /// When {price} was last raised. The allowance is measured from here.
    uint256 public accruedAt;

    error Unauthorized();
    error Retrograde();
    error Runaway(uint256 named, uint256 admissible);

    event Accrued(uint256 from, uint256 to);

    constructor(address collateral, address synthetic, address oracle_, uint256 ceiling_) {
        token = collateral;
        underlyingToken = synthetic;
        oracle = oracle_;
        ceiling = ceiling_;
        // Parity: one whole collateral token, one whole synthetic, before any
        // yield. Read from the synthetic because that is the unit being counted.
        price = 10 ** IERC20Metadata(synthetic).decimals();
        accruedAt = block.timestamp;
    }

    /// @notice Records yield the collateral has earned since the last call.
    function accrue(uint256 next) external {
        if (msg.sender != oracle) revert Unauthorized();
        if (next <= price) revert Retrograde();

        uint256 room = price * ceiling * (block.timestamp - accruedAt) / (365 days * 1e18);
        if (next - price > room) revert Runaway(next, price + room);

        emit Accrued(price, next);
        price = next;
        accruedAt = block.timestamp;
    }
}
