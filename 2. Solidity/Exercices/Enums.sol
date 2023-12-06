// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

contract Enums {
    enum Step {
        Before,
        WhitelistSale,
        Between,
        PublicSale,
        Finished,
        Reveal
    }

    Step public step;
    uint256 saleStartTime;

    function getStep() public view returns(Step actualStep) {
        if(block.timestamp < saleStartTime) {
            return Step.Before;
        }
        if(block.timestamp >= saleStartTime && block.timestamp < saleStartTime + 12 hours) {
            return Step.WhitelistSale;
        }
        if(block.timestamp >= saleStartTime + 12 hours && block.timestamp < saleStartTime + 24 hours) {
            return Step.Between;
        }
        if(block.timestamp >= saleStartTime + 24 hours && block.timestamp < saleStartTime + 48 hours) {
            return Step.PublicSale;
        }
        if(block.timestamp >= saleStartTime + 48 hours && block.timestamp < saleStartTime + 216 hours) {
            return Step.Finished;
        }
        if(block.timestamp >= saleStartTime + 216 hours) {
            return Step.Reveal;
        }
    }

    function mintWhitelist() external {
        require(getStep() == Step.WhitelistSale, "WhitelistSale is not activated");
        // etc.
    }
}