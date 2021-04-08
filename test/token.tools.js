const { expect } = require("chai");
const EVM_REVERT = 'VM Exception while processing transaction: revert';

describe("Token tools", async function() {
  
  it("interest operation in wei", () =>{
    const wei = 1000000000000000000n;
    const hour = 3600n;
    const month = 2635200n;
    const year = 31614774n;
    const year100 = 3161477400n;
    console.log('-- one minute interest is', 1n * hour * wei * 3n/year100);
    console.log('float -- 1050.35 fr one month interest 3% YPA is', 1050.35 * (3600 * 24 * 30.5) * 3/3161477400, '1.51/12 =',31.5105/12);
    console.log('wei   -- 1050.35 fr one month interest 3% YPA is', BigInt(1050.35 * 1e18) * (month) * 3n/year100, '1.51/12 =',31.5105/12);
  });

  it("laverage operation in wei", () =>{
    const wei = 1000000000000000000n;
    console.log('float -- debt laverage for 100 fr buy ',100 - 80 * .25,'debt', 80 * .25);
    const laverage = BigInt(.25 * 1e18);
    console.log('wei   -- debt laverage',laverage);
    console.log('wei   -- debt laverage for 100 fr buy ',100n*wei - 80n * laverage,'debt', 80n * laverage);

    expect( (100n*wei - 80n * laverage).toString()).eq((80n*wei).toString());
    expect( (80n * laverage).toString()).eq((20n*wei).toString());

  });

  it("eth:chf convertion in wei", () =>{
    const wei = 1000000000000000000n;
    console.log('-- one wei', wei);
    const eth_chf = 25.35 * 2000;
    console.log('float -- 100 chf to eth,wei', 0.05, 50000000000000000n);
    console.log('float -- 100 chf', 50000000000000000n*2000n);
    console.log('float -- 25.35 eth to chf ', eth_chf);
    const convertion = (2000n); //BigInt(.0005 * 1e18);
    console.log('wei   -- fixed eth:chf (2000:1)',convertion);
    console.log('wei   -- 25.35 eth to chf ',BigInt(25.35 * 1e18) * convertion);
    expect( (BigInt(25.35 * 1e18) * convertion).toString()).eq((BigInt(eth_chf)*wei).toString());
  });

  it("0.3% fees in wei ", () =>{
    const wei = 1000000000000000000n;
    const chf100 = 100n * wei;
    const fees = 3n / 1000n;
    console.log('-- one wei', wei, '100 chf', chf100, '0.3% fees wei',fees);
    console.log('float -- 0.3% on 100 chf', 0.003*100);
    console.log('wei   -- 100 chf wei', chf100);
    console.log('wei   -- 0.3% on 100 wei', chf100 * 3n / 1000n);
  });
    
});

