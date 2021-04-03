// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "./Token.sol";
import "hardhat/console.sol";

contract dBank {

  //assign Token contract to variable
  Token private token;

  //add mappings
  mapping(address => uint) public etherBalanceOf;
  mapping(address => uint) public depositStart;
  mapping(address => bool) public isDeposited;

  //add events
  event Deposit(address indexed user, uint etherAmount, uint timeStart);
  event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);
  event Interest(address indexed user, uint etherAmount, uint depositTime, uint interest);

  //pass as constructor argument deployed Token contract
  constructor(Token _token) public {
    //assign token deployed contract to variable
    token = _token;
  }

  function deposit() payable public {
    //check if msg.sender didn't already deposited funds
    require(isDeposited[msg.sender] == false, "Error, deposit already active!");
    //check if msg.value is >= than 0.01 ETH
    require(msg.value >= 1e15, "Error, deposit must be >= 0,001 ETH!");

    etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;
    depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
    isDeposited[msg.sender] = true;

    //emit Deposit event
    emit Deposit(msg.sender, msg.value, block.timestamp);
  }

  // 
  // use view for non-payable function
  function interestStatus() public returns (uint, uint, uint){
    require(isDeposited[msg.sender]==true, 'Error, no previous deposit');
    uint userBalance = etherBalanceOf[msg.sender]; 


    //check user's hodl time
    uint depositTime = block.timestamp - depositStart[msg.sender];

    //
    //calc interest per second
    //calc accrued interest
    //(etherBalanceOf[msg.sender] / 1e16) - calc. how much higher interest will be (based on deposit), e.g.:
    //for min. deposit (0.01 ETH), (etherBalanceOf[msg.sender] / 1e16) = 1 (the same, 31668017/s)
    //for deposit 0.02 ETH, (etherBalanceOf[msg.sender] / 1e16) = 2 (doubled, (2*31668017)/s)
    uint interestPerSecond = 31668017 * (userBalance / 1e15);
    uint interest = interestPerSecond * depositTime;

    //emit event        
    console.log("Interest:", userBalance, depositTime, interest);
    // emit is a payable function
    emit Interest(msg.sender, userBalance, depositTime, interest);    
    return (userBalance, depositTime, interest);
  }

  function withdraw() public {
    //check if msg.sender deposit status is true
    //assign msg.sender ether deposit balance to variable for event
    require(isDeposited[msg.sender]==true, 'Error, no previous deposit');
    uint userBalance = etherBalanceOf[msg.sender]; 


    //check user's hodl time
    uint depositTime = block.timestamp - depositStart[msg.sender];

    //
    //calc interest per second
    //calc accrued interest
    //(etherBalanceOf[msg.sender] / 1e16) - calc. how much higher interest will be (based on deposit), e.g.:
    //for min. deposit (0.01 ETH), (etherBalanceOf[msg.sender] / 1e16) = 1 (the same, 31668017/s)
    //for deposit 0.02 ETH, (etherBalanceOf[msg.sender] / 1e16) = 2 (doubled, (2*31668017)/s)
    uint interestPerSecond = 31668017 * (userBalance / 1e15);
    uint interest = interestPerSecond * depositTime;

    //console.log("Interest per second:", interestPerSecond,interest);


    //send eth to user
    msg.sender.transfer(userBalance);
    
    //send interest in tokens to user
    token.mint(msg.sender, interest);


    //reset depositer data
    etherBalanceOf[msg.sender] = 0;
    depositStart[msg.sender] = 0;
    isDeposited[msg.sender] = false;

    //emit event        
    emit Withdraw(msg.sender, userBalance, depositTime, interest);    
  }

  function borrow() payable public {
    //check if collateral is >= than 0.01 ETH
    //check if user doesn't have active loan

    //add msg.value to ether collateral

    //calc tokens amount to mint, 50% of msg.value

    //mint&send tokens to user

    //activate borrower's loan status

    //emit event
  }

  function payOff() public {
    //check if loan is active
    //transfer tokens from user back to the contract

    //calc fee

    //send user's collateral minus fee

    //reset borrower's data

    //emit event
  }
}