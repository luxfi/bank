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

    /// Synthetic units per whole collateral token.
    uint256 public price;

    error Unauthorized();
    error Retrograde();

    event Accrued(uint256 from, uint256 to);

    constructor(address collateral, address synthetic, address oracle_) {
        token = collateral;
        underlyingToken = synthetic;
        oracle = oracle_;
        // Parity: one whole collateral token, one whole synthetic, before any
        // yield. Read from the synthetic because that is the unit being counted.
        price = 10 ** IERC20Metadata(synthetic).decimals();
    }

    /// @notice Records yield the collateral has earned since the last call.
    function accrue(uint256 next) external {
        if (msg.sender != oracle) revert Unauthorized();
        if (next <= price) revert Retrograde();
        emit Accrued(price, next);
        price = next;
    }
}
