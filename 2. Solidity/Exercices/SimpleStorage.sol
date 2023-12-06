//SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

contract SimpleStorage {
    uint256 internal number;

    function get() external view returns(uint) {
        return number;
    }

    function set(uint256 _number) external {
        number = _number;
    }
}