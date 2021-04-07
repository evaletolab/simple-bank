// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

//
// examples,
// - https://github.com/makerdao/developerguides/blob/master/dai/dai-token/dai-token.md#token-contract
// - DAI-v1 https://github.com/makerdao/sai/blob/dai-v1/src/weth9.sol
// - 1000000158153903837946257  // 0.5% 1WEI / year 
//   10000000001581539061n                
// - https://github.com/dapphub/ds-math
// - https://ethereum.stackexchange.com/questions/63377/make-a-contract-send-a-percentage-to-a-specific-wallet-always

contract Token is ERC20 {
  address public minter;

  //
  // wei / eth unit converter
  uint public constant DEFAULT_WEI = 1e18;

  //
  // default transaction fees in wei, fixed 0.3%,  ((3n*DEFAULT_WEI) / (31614774n * 1000) + DEFAULT_WEI)
  uint public constant DEFAULT_FEE = 1000000000094892343;


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

  function transfer(address _to, uint256 _value) public virtual override returns (bool success) {
    return transferFrom(msg.sender,_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) public virtual override returns (bool success) {
    uint fees = _value * DEFAULT_FEE;
    super.transferFrom(_from,minter,fees);
    super.transferFrom(_from,_to, (_value - fees));
    return true;
  }

}