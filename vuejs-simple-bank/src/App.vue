<template>
  <div id="app">

    <section>
        <b-tabs v-model="activeTab">
            <b-tab-item label="Deposit">
              <SimpleBank />
            </b-tab-item>

            <b-tab-item label="Music">
                Lorem <br>
                ipsum <br>
                dolor <br>
                sit <br>
                amet.
            </b-tab-item>

            <b-tab-item label="Videos" disabled>
                Nunc nec velit nec libero vestibulum eleifend.
                Curabitur pulvinar congue luctus.
                Nullam hendrerit iaculis augue vitae ornare.
                Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget.
            </b-tab-item>
        </b-tabs>
    </section>    
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
