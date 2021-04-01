<template>
  <div id="app">
    <SimpleBank />
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SimpleBank from './components/SimpleBank.vue'
import pkg from '../package.json';


@Component({
  components:{ SimpleBank }
})
export default class App extends Vue {
  version = pkg.version;
  activeTab = 0;
}
</script> 

<style lang="scss">

// 
// global style
@import "./app.scss";

#app {
  font-family: suisse, Sans-Serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
