import Component from 'vue-class-component'

// cf -> https://class-component.vuejs.org/guide/additional-hooks.html

console.log("registering class component hooks");

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])