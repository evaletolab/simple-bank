// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

//
// examples,
// - https://github.com/makerdao/developerguides/blob/master/dai/dai-token/dai-token.md#token-contract
// - https://github.com/aave/aave-protocol/blob/master/contracts/configuration/LendingPoolParametersProvider.sol
// - DAI-v1 https://github.com/makerdao/sai/blob/dai-v1/src/weth9.sol
// - 1000000158153903837946257  // 0.5% 1WEI / year 
//   10000000001581539061n = ((3n*DEFAULT_WEI) / (31614774n * 1000) + DEFAULT_WEI)
// - https://github.com/dapphub/ds-math
// - https://ethereum.stackexchange.com/questions/63377/make-a-contract-send-a-percentage-to-a-specific-wallet-always

contract Token is ERC20 {
  address public minter;

  //
  // wei / eth unit converter
  uint public constant DEFAULT_WEI = 1000000000000000000;

  //
  // default transaction fees in wei, fixed 0.3%,  
  uint public constant DEFAULT_FEE = 1000;


  //add minter changed event
  event MinterChanged(address indexed from, address to); 

  constructor() public payable ERC20("One Less Bank", "xTEL") {
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
    uint fees = (_value * 3) / DEFAULT_FEE;
    console.log("tx amount, fees:", _value,fees);

    approve(msg.sender, _value);

    //allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

    super.transferFrom(_from,minter,fees);
    super.transferFrom(_from,_to, (_value - fees));
    return true;
  }

}