// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./ISimpleStorage.sol";

contract SimpleStorageTest {
    ISimpleStorage SimpleStorage;

    constructor(ISimpleStorage _SimpleStorage) {
        SimpleStorage = _SimpleStorage;
    }

    function callSet(uint _number) external {
        SimpleStorage.set(_number);
    }

    function callGet() external view returns(uint) {
        return SimpleStorage.get();
    }
}