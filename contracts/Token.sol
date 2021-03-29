// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Token is ERC20 {
  address public minter;

  //add minter changed event
  event MinterChanged(address indexed from, address to); 

  constructor() public payable ERC20("Credit Genevois Illimite", "CGE") {
    minter = msg.sender;
  }

  //Add pass minter role function
  function passMinterRole(address dbank) public returns (bool) {
    require(msg.sender == minter,"Tu ne peux pas deleguer le droit de battre ma monnaie");

    //
    // check other contract
    minter = dbank;
    emit MinterChanged(msg.sender, dbank);
    return true;
  }

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender == minter,"Tu n'as pas le droit de battre ma monnaie");
		_mint(account, amount);
	}
}