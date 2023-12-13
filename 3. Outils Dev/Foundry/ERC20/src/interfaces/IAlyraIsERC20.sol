// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IERC20 } from './IERC20.sol';

interface IAlyraIsERC20 is IERC20 {
    function mint(address to, uint256 amount) external payable;
}