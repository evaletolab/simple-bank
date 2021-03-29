<template>
  <div class="bank">
    <h1>Bienvenue dans votre banque!!</h1>
    <h2>{{account}}</h2>
    <br/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Web3 from 'web3';

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

  beforeMount(){
    //
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

    const web3 = new Web3($window.ethereum);
    const netId = await web3.eth.net.getId();
    const accounts = await web3.eth.getAccounts();

    
    const metamask = await $window.ethereum.request({ method: 'eth_requestAccounts' });



    const account = accounts[0] || metamask[0];
    //
    //load balance
    if(!account){
      window.alert('Please login with MetaMask');
      return;
    }

    

    this.balance = await web3.eth.getBalance(account);
    this.account = account;

    //
    //load contracts
    try {
      this.token = new web3.eth.Contract(this.Token.abi,this.Token.address);
      this.dbank = new web3.eth.Contract(this.dBank.abi,this.dBank.address);
      this.dBankAddress = this.dBank.address;
    } catch (e) {
      console.log('Error', e);
      window.alert('Contracts not deployed to the current network')
    }

  }

  async deposit(amount) {
    if(!this.dbank){
      // TODO WARN
    }
    try{
      await this.dbank.methods.deposit().send({value: amount.toString(), from: this.account})
    } catch (e) {
      console.log('Error, deposit: ', e)
    }
  }

  async withdraw(e) {
    e.preventDefault();
    if(!this.dbank){
      // TODO WARN
    }

    try{
      await this.dbank.methods.withdraw().send({from: this.account})
    } catch(e) {
      console.log('Error, withdraw: ', e)
    }
  }

  async borrow(amount) {
    if(!this.dbank){
      // TODO WARN
    }
    try{
      await this.dbank.methods.borrow().send({value: amount.toString(), from: this.account})
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
      const collateralEther = await this.dbank.methods.collateralEther(this.account).call({from: this.account})
      const tokenBorrowed = collateralEther/2
      await this.token.methods.approve(this.dBankAddress, tokenBorrowed.toString()).send({from: this.account})
      await this.dbank.methods.payOff().send({from: this.account})
    } catch(e) {
      console.log('Error, pay off: ', e)
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
