<template>
  <div class="landing">

  </div>
</template>

<style lang="scss" scoped>

  .landing{
    display: block;
  }
  
  .version {
    font-weight: 200;
    opacity: .5;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { $config, $user } from '../services';

import CMSIcons from '../components/CMSIcons.vue';

@Component({
  components: {
    CMSIcons    
  },
})
export default class Landing extends Vue {
  open = false;
  deferredPrompt: any = {};
  pseudo = '';

  async mounted(){
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();

      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
  }

  get config(){
    return $config.store.config;
  }

  get user() {
    return $user.user;
  }

  beforeRouteEnter(to: any, from: any, next: any) {
    const all = [$config.get(),$user.get()]
    Promise.all(all).then(([config, user])=> {
      if(user.id && user.name) {
        return next('/content');
      }
      next();
    })
  }

  onEnter(username){
    console.log('--- DBG entrer',username)
    $user.createUser(username)
    this.$router.push({path:'/content' });
  }

  onToggle(){
    this.open = !this.open;
  }
  
  onInstall($event) {
    const deferredPrompt = this.deferredPrompt;
    // Show the prompt
    if(!deferredPrompt.prompt) {
      console.log('---DBG alternative install message',$event);
      $event.preventDefault();
      $event.stopPropagation();
      return;
    }

    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt', choiceResult);
      } else {
        console.log('User dismissed the A2HS prompt', choiceResult);
      }
      this.deferredPrompt = {};
    });    
  }

}
</script>
