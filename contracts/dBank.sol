// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "./Token.sol";
import "hardhat/console.sol";

contract dBank {

  // bank owner FIXME not mandatory
  address public owner;

  //assign Token contract to variable
  Token private token;

  //add mappings
  mapping(address => uint) public etherBalanceOf;
  mapping(address => uint) public depositStart;
  mapping(address => bool) public isDeposited;

  //
  // total amount deposited (source symbol)
  // FIXME We should lock 10% of the (totalLiquidity - totalLocked) for withdraw
  uint public totalLiquidity = 0;

  //
  // total deposited amount locked in debt (source symbol)
  uint public totalLocked = 0;

  //
  // debt laverage (buy 80 chf and get 100 chf ) (0.25 * 1e18)
  uint256 private constant DEFAULT_LEVERAGE = 4;

  //
  // wei / eth unit converter
  uint public DEFAULT_WEI = 1e18;

  //
  // default YPA / [s]
  // 3% YPA = 3 / (31614774[s]+100) per 1[s]
  // input * time * (3n / 3161477400n)
  uint256 private constant DEFAULT_YPA_S = 948923436;

  //
  // eth/chf price is fixed 1:2000 (x 2000)
  uint256 private constant DEFAULT_ETH_CHF = 2000;

  //
  // add events
  event Deposit(address indexed user, uint etherAmount, uint timeStart);
  event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);
  event Interest(address indexed user, uint etherAmount, uint depositTime, uint interest);

  //pass as constructor argument deployed Token contract
  constructor(Token _token) public {
    //assign token deployed contract to variable
    token = _token;
    owner = msg.sender;
  }

  //
  // oneway debt provider
  // check liquidity and accept contract
  // minimal 100 chf buy
  function buy() payable public {    
    //
    // convert amount
    uint weiAmount = (msg.value);
    uint chfAmount = (msg.value * DEFAULT_ETH_CHF);
    // console.log('buy -- chf  ',chfAmount);
    // console.log('buy -- wei  ',weiAmount);
    // console.log('buy -- limit',(80 * 1e18));
    // console.log('buy -- limit',(5 * 80 * 1e18));

    require(chfAmount >= (80 * 1e18), "Error, buy must be >= 80 xCHF!");
    require(chfAmount <= (5 * 80 * 1e18), "Error, buy must be <= 400 xCHF!");

    //
    // check if there is available liquidity
    uint debtAmount = weiAmount / DEFAULT_LEVERAGE;
    // console.log('buy -- lquidity',totalLiquidity);
    // console.log('buy -- locked  ',totalLocked);
    // console.log('buy -- debt    ',debtAmount);

    require((totalLiquidity - totalLocked) >= debtAmount , "Error, not enough liquidity!");

    //
    // mint chf(debtAmount) + chfAmount;
    // for input 80 chf => 100 chf are minted
    uint mintAmount = (weiAmount + debtAmount) * DEFAULT_ETH_CHF;
    token.mint(msg.sender, mintAmount);

    //
    // locked amount 
    totalLocked = totalLocked + debtAmount; 
  }

  //
  // create debt liquidity
  // only one deposit by address
  function deposit() payable public {
    //check if msg.sender didn't already deposited funds
    require(isDeposited[msg.sender] == false, "Error, deposit already active!");

    //check if msg.value is >= than 0.01 ETH
    require(msg.value >= 1e16, "Error, deposit must be >= 0,01 ETH!");

    //
    // store liquidity
    etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;
    depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
    isDeposited[msg.sender] = true;

    totalLiquidity = totalLiquidity + msg.value;

    //emit Deposit event
    emit Deposit(msg.sender, msg.value, block.timestamp);
  }

  // 
  // depositer can have an over
  function interestStatus() public returns (uint, uint, uint){
    require(isDeposited[msg.sender]==true, 'Error, no previous deposit');
    uint userBalance = etherBalanceOf[msg.sender]; 


    //check user's hodl time
    uint depositTime = block.timestamp - depositStart[msg.sender];

    //
    //calc interest per second
    uint interest = DEFAULT_YPA_S * (userBalance) * depositTime / 1e18;

    //emit event        
    // console.log("Interest:", userBalance, depositTime, interest);
    // emit is a payable function
    emit Interest(msg.sender, userBalance, depositTime, interest);    

    return (userBalance, depositTime, interest);
  }

  function withdraw() public {
    //check if msg.sender deposit status is true
    //assign msg.sender ether deposit balance to variable for event
    require(isDeposited[msg.sender]==true, 'Error, no previous deposit');

    //
    // check if there is enough liquidity for a withdraw
    uint userBalance = etherBalanceOf[msg.sender]; 
    require((totalLiquidity - totalLocked) < userBalance , "Error, not enough liquidity for withdraw, please wait!");


    //check user's hodl time
    uint depositTime = block.timestamp - depositStart[msg.sender];

    //
    // Calc interest per second bysed on YPA
    uint interest = DEFAULT_YPA_S * (userBalance) * depositTime;
    //console.log("Interest per second:", interestPerSecond,interest);

    //    
    //send interest in tokens to user
    token.mint(msg.sender, interest);

    //
    //send back eth to user
    msg.sender.transfer(userBalance);


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