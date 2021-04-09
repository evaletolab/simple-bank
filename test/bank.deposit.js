const { expect } = require("chai");
const EVM_REVERT = 'VM Exception while processing transaction: revert';

const wait = s => {  
  const milliseconds = s * 1000;
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}


describe("dBank.deposit", async function() {
  const Token = await ethers.getContractFactory("Token");
  const DecentralizedBank = await ethers.getContractFactory("dBank");

  //
  // fist account is deployer
  // second account is our first user
  const [deployer, user, alice] = await ethers.getSigners();

  let dbank, token;

  beforeEach(async () => {
    token = await Token.deploy();
    dbank = await DecentralizedBank.deploy(token.address);
    await token.passMinterRole(dbank.address);
  })


  describe('deposit', () => {
    const eth005 = BigInt(0.05 * 1e18);
    describe('deposit success', async () => {
      beforeEach(async () => {
        // deposit 100 chf (0.05 ether)
        await dbank.connect(user).deposit({value:eth005}) //0.5 ETH
      })

      it('balance should increase', async () => {
        expect(Number(await dbank.etherBalanceOf(user.address))).to.eq(Number(eth005))
      })

      it('deposit time should > 0', async () => {
        expect(Number(await dbank.depositStart(user.address))).to.be.above(0)
      })

      it('deposit status should eq true', async () => {
        expect(await dbank.isDeposited(user.address)).to.eq(true)
      })

      // it('interest after one second should > 0', async ()=>{
      //   expect(
      //    await dbank.connect(user).interestStatus()
      //   ).to.eq([BigNumber.from(10**15), BigNumber.from(1), BigNumber.from(31668017)])
      //  })
 
      it('deposit get interest should > 0', async ()=>{

        // FIXME verify output 47446171 
        await expect(dbank.connect(user).interestStatus())
                  .to.emit(dbank, 'Interest')
                  .withArgs(user.address, eth005, 1, 47446171);
                  // .withArgs(user.address, eth005, 1, 948923436);        
      });

      it('deposit totalLiquidity > 0', async () => {
        expect(Number(await dbank.totalLiquidity())).to.eq(Number(eth005));
      })

      it('deposit totalLocked == 0', async () => {
        expect(Number(await dbank.totalLocked())).to.eq(0);
      })

    });

    describe('deposit failure', async () => {
      it('depositing should be rejected', async () => {
        const value = 0.001 * 1e18;
        await expect(
          dbank.connect(user).deposit({value})
        ).to.be.revertedWith(EVM_REVERT) //to small amount
      })
    });  
  })

  describe('buy', () => {
    const eth005 = BigInt(0.05 * 1e18);
    const chf80 =  BigInt(80 * 1e18 / 2000);
    const chf20 =  BigInt(20 * 1e18 / 2000);


    describe('buy success', async () => {
      beforeEach(async () => {
        // deposit 100 chf (0.05 ether)
        await dbank.connect(user).deposit({value:eth005}) //0.5 ETH
        await dbank.connect(alice).buy({value:chf80}); // buy 100chf with 80 chf
      });

      it('deposit totalLiquidity > 0', async () => {
        expect(Number(await dbank.totalLiquidity())).to.eq(Number(eth005));
      });

      it('deposit totalLocked == 20 chf ( 20 / 2000 * 1e18 )', async () => {
        expect(Number(await dbank.totalLocked())).to.eq(Number(chf20));
      });
    }); 
    describe('buy failure', async () => {
      const chf401 =  BigInt(401 * 1e18 / 2000);
      const chf20 =  BigInt(20 * 1e18 / 2000);
      beforeEach(async () => {
        // deposit 100 chf (0.05 ether)
        await dbank.connect(user).deposit({value:eth005}) //0.5 ETH
      })

      it('buy failure < 80 chf', async () => {
        await expect(
          dbank.connect(alice).buy({value:chf20}) // buy 100chf with 80 chf
        ).to.be.revertedWith('buy must be >= 80 xCHF') //to small amount
      });

      it('buy failure > 400 chf', async () => {
        await expect(
          dbank.connect(alice).buy({value:chf401}) // buy 100chf with 80 chf
        ).to.be.revertedWith('buy must be <= 400 xCHF') //to small amount
      });

    });

  })

});
