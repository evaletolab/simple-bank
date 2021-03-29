const { expect } = require("chai");
const EVM_REVERT = 'VM Exception while processing transaction: revert';

describe("Token", async function() {
  
const wait = s => {  
  const milliseconds = s * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const Token = await ethers.getContractFactory("Token");
  const DecentralizedBank = await ethers.getContractFactory("dBank");

  //
  // fist account is deployer
  // second account is our first user
  const [deployer, user] = await ethers.getSigners();

  console.log('--- deployer', deployer.address);
  console.log('--- user', user.address);
  console.log("--- user balance:", (await user.getBalance()).toString());
  //
  // https://github.com/nomiclabs/hardhat/blob/0b064c8eaa58975bf84e60b1058d296fccc3d9eb/docs/tutorial/testing-contracts.md

  let dbank, token;

  beforeEach(async () => {
    token = await Token.deploy();
    dbank = await DecentralizedBank.deploy(token.address);
    await token.passMinterRole(dbank.address, {from: deployer.address});
  })


  describe('testing token contract...', () => {
    describe('success', () => {
      it('checking token name', async () => {
        expect(await token.name()).to.be.eq('Credit Genevois Illimite')
      })
      it('checking token symbol', async () => {
        expect(await token.symbol()).to.be.eq('CGE')
      })

      it('checking token initial total supply', async () => {
        expect(Number(await token.totalSupply())).to.eq(0)
      })

      it('dBank should have Token minter role', async () => {
        expect(await token.minter()).to.eq(dbank.address)
      })      
    })
  })

  describe('testing deposit...', () => {
    let balance

    describe('success', () => {
      beforeEach(async () => {
        await dbank.connect(user).deposit({value:10**15}) //0.001 ETH
      })

      it('balance should increase', async () => {
        expect(Number(await dbank.etherBalanceOf(user.address))).to.eq(10**15)
      })

      it('deposit time should > 0', async () => {
        expect(Number(await dbank.depositStart(user.address))).to.be.above(0)
      })

      it('deposit status should eq true', async () => {
        expect(await dbank.isDeposited(user.address)).to.eq(true)
      })
    })

    describe('failure', async () => {
      it('depositing should be rejected', async () => {
        await expect(
          dbank.connect(user).deposit({value: 10**14})
        ).to.be.revertedWith(EVM_REVERT) //to small amount
      })
    })    
  })

  describe('testing withdraw...', () => {
    let balance;
    //
    //(10% APY) for min. deposit (0.01 ETH)
    const interestPerSecond = 31668017 


    describe('success', () => {

      beforeEach(async () => {
        console.log('--- user balance',(await web3.eth.getBalance(user.address)));
        await dbank.connect(user).deposit({value: 10**15}) //0.001 ETH

        await wait(1) //accruing interest

        balance = await web3.eth.getBalance(user.address);
        // console.log('--- user balance',balance);
        // console.log('--- user token balance',Number(await token.balanceOf(user.address)));

        await dbank.connect(user).withdraw();
      })

      it('balances should decrease', async () => {
        expect(Number(await web3.eth.getBalance(dbank.address))).to.eq(0)
        expect(Number(await dbank.etherBalanceOf(user.address))).to.eq(0)
      })

      it('user should receive ether back', async () => {
        expect(Number(await web3.eth.getBalance(user.address))).to.be.above(Number(balance))
      })

      it('user should receive proper amount of interest', async () => {
        //time synchronization problem make us check the 1-3s range for 2s deposit time
        balance = Number(await token.balanceOf(user.address))
        console.log('--- user token balance',balance);

        expect(balance).to.be.above(0)
        expect(balance%interestPerSecond).to.eq(0)
        expect(balance).to.be.below(interestPerSecond*4)
      })

      it('depositer data should be reseted', async () => {
        expect(Number(await dbank.depositStart(user.address))).to.eq(0)
        expect(Number(await dbank.etherBalanceOf(user.address))).to.eq(0)
        expect(await dbank.isDeposited(user.address)).to.eq(false)
      })
    })

    // describe('failure', () => {
    //   it('withdrawing should be rejected', async () =>{
    //     await dbank.connect(user).deposit({value: 10**15}) //0.001 ETH
    //     await wait(2) //accruing interest
    //     await expect(
    //       dbank.connect(user).withdraw()
    //     ).to.be.revertedWith(EVM_REVERT) //wrong user

    //   })
    // })
  })  

});
