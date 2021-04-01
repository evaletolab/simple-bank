require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log('Account',account.address, web3.utils.fromWei(await web3.eth.getBalance(account.address)));    
  }
  // console.log('Private Key',accounts[0])
});

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async taskArgs => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
  });  
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

/**
 * forking network
 * networks:{
    hardhat:{
      forking:{
        url:"https://eth-ropsten.alchemyapi.io/v2/e-8uQkOovJBEuOYF4DTXJ338fcQOfLrT"
      },
      chainId: 1337,
      inject: false, // optional. If true, it will EXPOSE your mnemonic in your frontend code. Then it would be available as an "in-page browser wallet" / signer which can sign without confirmation.
      accounts: {
        mnemonic: "test test test test test test test test test test test junk", // test test test test test test test test test test test junk
      }
    }
  }

 */ 
module.exports = {
  solidity: "0.7.3",
  hardhat: {
    inject: false, // optional. If true, it will EXPOSE your mnemonic in your frontend code. Then it would be available as an "in-page browser wallet" / signer which can sign without confirmation.
    accounts: {
      mnemonic: "test test test test test test test test test test test junk", // test test test test test test test test test test test junk
    }
  } 
};

