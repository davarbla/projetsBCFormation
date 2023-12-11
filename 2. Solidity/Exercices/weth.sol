pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract weth is ERC20  {

    // contrat exemple, non fini

    constructor() ERC20("WETH, "weth"){

    }

    function buyWeth() payable{
        uint nombre = msg.value;
        _mint(msg.sender, nombre);
    }

    function repay (uint amount) {
        transfer(address(this), amount );
        msg.sender.call(""){value: amount};
    }

}