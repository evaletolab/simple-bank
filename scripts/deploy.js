// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const TokenABI = require('../artifacts/contracts/Token.sol/Token.json');
const dBankABI = require('../artifacts/contracts/dBank.sol/dBank.json');
const fs = require('fs');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();

  await token.deployed();

  console.log("Token deployed to:", token.address);
  console.log("Token save ABI:");
  const tABI = {
    abi : TokenABI.abi,
    address : token.address
  };
  fs.writeFileSync("./vuejs-simple-bank/abis/Token.json", JSON.stringify(tABI,0, 2),{encoding:'utf8',flag:'w'});



  const DecentralizedBank = await hre.ethers.getContractFactory("dBank");
  const dbank = await DecentralizedBank.deploy(token.address);
  await dbank.deployed();


  console.log("DecentralizedBank deployed to:", dbank.address);


	//change token's owner/minter from deployer to dBank
	await token.passMinterRole(dbank.address)  
  console.log("DecentralizedBank get minted role");
  console.log("DecentralizedBank save ABI:");
  const dABI = {
    abi : dBankABI.abi,
    address : dbank.address
  };
  fs.writeFileSync("./vuejs-simple-bank/abis/dBank.json", JSON.stringify(dABI,0, 2),{encoding:'utf8',flag:'w'});

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
