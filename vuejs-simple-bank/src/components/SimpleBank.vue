<template>
  <div class="bank">
    <h1>Bienvenue dans votre banque!!</h1>
    <h2>Connecté avec: {{account}} ({{formatEther(balance)}} ETH)</h2>
    <h2>Montants déposés: {{formatEther(depositedAmount)}} ETH</h2>
    <br/>

    <section>
        <b-tabs v-model="activeTab">
            <b-tab-item label="Deposit">
              <div>
                <p>How much do you want to deposit?</p>
                <p>(min. amount is 0.001 ETH)</p>
                <p>(1 deposit is possible at the time)</p>
                <form  @submit="onDeposit">
                  <b-field label="Amount">
                    <b-input 
                      v-model="depositAmount"
                      step="0.01"
                      type='number' placeholder='amount...'></b-input>
                  </b-field>
                  <b-button type='submit' value="DEPOSIT">DEPOSIT</b-button>
                </form>
              </div>
            </b-tab-item>

            <b-tab-item label="Withdraw">
              <div>
                <p>How much do you want to deposit?</p>
                <p>(min. amount is 0.001 ETH)</p>
                <p>(1 deposit is possible at the time)</p>
                <form  @submit="onWithdraw">
                  <b-button @click="onWithdraw" value="WITHDRAW">WITHDRAW</b-button>
                </form>
              </div>

              
            </b-tab-item>

            <b-tab-item label="Videos" disabled>
                Nunc nec velit nec libero vestibulum eleifend.
                Curabitur pulvinar congue luctus.
                Nullam hendrerit iaculis augue vitae ornare.
                Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget.
            </b-tab-item>
        </b-tabs>
    </section>    

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ethers } from "ethers";

import Token from '../../abis/Token.json';
import dBank from '../../abis/dBank.json';

@Component({
  components: { },
})
export default class SimpleBank extends Vue {

  account = null as any;
  balance = '0';
  token = {} as any; 
  dbank = {} as any; 
  dBankAddress = {};

  //
  // form
  activeTab = 0;
  depositAmount = 0;
  depositedAmount = 0;

  beforeMount(){
    //
  }

  formatEther(amount) {
    return ethers.utils.formatEther(amount);
  }

  get Token() {
    return Token as any;
  }

  get dBank() {
    return dBank as any;
  }

  async mounted(){
    await this.loadWeb3()
  }

  beforeDestroy(){
    //
  }

  async loadWeb3() {
    const $window = window as any;
    if(!$window.ethereum){
      window.alert('Please install MetaMask');
      return;
    }



    //const web3 = new Web3($window.ethereum);
    // const netId = await web3.eth.net.getId();
    // const accounts = await web3.eth.getAccounts();    
    // const metamask = await $window.ethereum.request({ method: 'eth_requestAccounts' });
    // const account = accounts[0] || metamask[0];

    //
    // initialize metamask
    const [account] = await $window.ethereum.enable();    
    console.log('--- DBG account',account);
    if(!account){
      window.alert('Please login with MetaMask');
      return;
    }


    const provider = new ethers.providers.Web3Provider($window.ethereum);
    const signer = provider.getSigner();
    console.log('--- DBG signer0',await signer.getAddress());
    console.log('--- DBG signer1',await signer.getChainId());
    console.log('--- DBG signer2',(await signer.getBalance()).toString());
    // working well
    //console.log('--- DBG signer2',await signer.signMessage('testing signature'));

    const metamask = await $window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('--- DBG metamask',metamask);



    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.

    //
    //load balance

    

    // this.balance = await web3.eth.getBalance(account);
    this.balance = (await provider.getBalance(account)).toString();

    this.account = account;

    //
    //load contracts
    try {
      this.token = new ethers.Contract(
        this.Token.address,
        this.Token.abi,
        signer
      );

      this.dbank = new ethers.Contract(
        this.dBank.address,
        this.dBank.abi,
        signer
      );

      this.dBankAddress = this.dBank.address;
      this.depositedAmount = (await this.dbank.etherBalanceOf(this.account)).toString();
      console.log('--- DBG dbank address',this.dBankAddress);
      
      const signerAddress = await signer.getAddress();
      console.log('--- DBG signer deposit',this.account, this.depositedAmount );

    } catch (e) {
      console.log('Error', e);
      window.alert('Contracts not deployed to the current network')
    }

  }

  async deposit(amount) {
    console.log('--DBG',this.dbank);
    if(!this.dbank){
      // TODO WARN
    }
    try{
      const result = await this.dbank.deposit({value:amount.toString()});

    } catch (e) {
      console.log('Error, deposit: ', e)
    }
  }

  async borrow(amount) {
    if(!this.dbank){
      // TODO WARN
    }
    try{
      await this.dbank.borrow().send({value: amount.toString(), from: this.account})
    } catch (e) {
      console.log('Error, borrow: ', e)
    }
  }

  async payOff(e) {
    e.preventDefault();
    if(!this.dbank){
      // TODO WARN
    }

    try{
      const collateralEther = await this.dbank.collateralEther(this.account).call({from: this.account})
      const tokenBorrowed = collateralEther/2
      await this.token.approve(this.dBankAddress, tokenBorrowed.toString()).send({from: this.account})
      await this.dbank.payOff().send({from: this.account})
    } catch(e) {
      console.log('Error, pay off: ', e)
    }
  }  

  async onDeposit($evt) {
    $evt.preventDefault();

    //
    //convert to wei
    await this.deposit(this.depositAmount * 10**18);
  }

  async onWithdraw($evt) {
    $evt.preventDefault();
    if(!this.dbank){
      // TODO WARN
    }

    try{
      await this.dbank.withdraw();
    } catch(e) {
      console.log('Error, withdraw: ', e)
    }
  }

}
</script>






<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
