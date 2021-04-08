const { expect } = require("chai");
const EVM_REVERT = 'VM Exception while processing transaction: revert';
const wait = s => {  
  const milliseconds = s * 1000;
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

describe("Token", async function() {
  const Token = await ethers.getContractFactory("Token");
  const DecentralizedBank = await ethers.getContractFactory("dBank");

  //
  // fist account is deployer
  // second account is our first user
  const [deployer, user,alice] = await ethers.getSigners();

  console.log('--- deployer', deployer.address);
  console.log('--- user', user.address);
  console.log("--- user balance:", (await user.getBalance()).toString());
  //
  // https://github.com/nomiclabs/hardhat/blob/0b064c8eaa58975bf84e60b1058d296fccc3d9eb/docs/tutorial/testing-contracts.md

  let dbank, token;

  beforeEach(async () => {
    token = await Token.deploy();
    dbank = await DecentralizedBank.deploy(token.address);
  })


  describe('testing token contract...', () => {
    describe('success', () => {
      it('checking token name', async () => {
        expect(await token.name()).to.be.eq('One Less Bank')
      })
      it('checking token symbol', async () => {
        expect(await token.symbol()).to.be.eq('xTEL')
      })

      it('checking token initial total supply', async () => {
        expect(Number(await token.totalSupply())).to.eq(0)
      })

      it('dBank should have Token minter role', async () => {
        await token.passMinterRole(dbank.address);
        expect(await token.minter()).to.eq(dbank.address)
      })      
    })
  })

  describe('token transaction fees', () => {
    it('checking token total supply', async () => {
      const chf100 = 100n * 1000000000000000000n;      
      await token.mint(user.address,chf100);
      expect(Number(await token.totalSupply()).toString()).to.eq(chf100.toString());
    })

    it('checking token transfer', async () => {
      const chf100 = 100n * 1000000000000000000n;    
      const chf50 = 50n * 1000000000000000000n;    
      const chffees = (chf50 * 3n) / 1000n;
      const trasnferedAmount = chf50 - chffees;   

      //
      // mint initial token amount
      token.mint(user.address,chf100);
      const totalamount = (await token.totalSupply());
      expect(totalamount.toString()).to.eq(chf100.toString());

      //
      // tranfer minter role 
      await token.passMinterRole(dbank.address);

      let useramount = await token.balanceOf(user.address);
      expect(useramount.toString()).to.eq(chf100.toString());

      let aliceamount = await token.balanceOf(alice.address);
      expect(aliceamount.toString()).to.eq('0');

      let dbankamount = await token.balanceOf(dbank.address);
      expect(dbankamount.toString()).to.eq('0');

      //
      // transfert 50 chf to alice
      await token.connect(user).transfer(alice.address, chf50);

      //
      // verify account user, alice and bank
      useramount = await token.balanceOf(user.address);
      expect(useramount.toString()).to.eq((chf100-chf50).toString());

      aliceamount = await token.balanceOf(alice.address);
      expect(aliceamount.toString()).to.eq(trasnferedAmount.toString());

      dbankamount = await token.balanceOf(dbank.address);
      expect(dbankamount.toString()).to.eq(chffees.toString());
    });
  });
});
