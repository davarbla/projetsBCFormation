// SPDX-License-Id1ntifier: MIT
pragma solidity 0.8.22;

contract parent {
    // Internal pour être lue depuis les contrats enfants
    uint256 sum;

    function setValue(uint256 _value) external {
        sum = _value;
    }
}

contract child is parent {
    // Du coup ici on peut récupérer la variable sum
    function getValue() external returns(uint256) {
        return sum;
    }
}

contract caller {
    // On crée un contrat child
    

    function testInheritance(uint256 _value) public returns(uint256) {
        child cc = new child();
        cc.setValue(_value);
        return cc.getValue();
    }
}