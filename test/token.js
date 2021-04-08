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
      token.mint(user.address,chf100);

      //
      // fees destination
      await token.passMinterRole(dbank.address);

      const totalamount = (await token.totalSupply());
      expect(totalamount.toString()).to.eq(chf100.toString());
      let useramount = await token.balanceOf(user.address);
      let aliceamount = await token.balanceOf(alice.address);
      let dbankamount = await token.balanceOf(dbank.address);
      console.log('0 --- total balance',totalamount.toString(),chf100);
      console.log('0 --- user balance',useramount.toString());
      console.log('0 --- alice balance',aliceamount.toString());
      console.log('0 --- bank balance',dbankamount.toString());

      await token.connect(user).transfer(alice.address, 50n*1000000000000000000n);
      useramount = await token.balanceOf(user.address);
      aliceamount = await token.balanceOf(alice.address);
      dbankamount = await token.balanceOf(dbank.address);
      console.log('1 --- user balance',useramount.toString());
      console.log('1 --- alice balance',aliceamount.toString(),alice.address);
      console.log('1 --- bank balance',dbankamount.toString(),dbank.address);
      //expect(await token.balanceOf(alice.address)).to.equal(50);      
    });
  });
});
