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
    await token.passMinterRole(dbank.address, {from: deployer.address});
  })

  describe('deposit failure', async () => {
    it('depositing should be rejected', async () => {
      const value = 0.001 * 1e18;
      await expect(
        dbank.connect(user).deposit({value})
      ).to.be.revertedWith(EVM_REVERT) //to small amount
    })
  });

  describe('deposit success', () => {
    const eth005 = BigInt(0.05 * 1e18);
    let balance

    describe('success', async () => {
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
 
      it('interest after one second should > 0', async ()=>{

       await expect(dbank.connect(user).interestStatus())
                  .to.emit(dbank, 'Interest')
                  .withArgs(user.address, eth005, 1, 47446171);        
                  // .withArgs(user.address, eth005, 1, 948923436);        
                })
    })    
  })

});
