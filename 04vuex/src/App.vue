<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    {{ count }}
    {{ counts }}
    {{ doubleCount }}
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { mapState, mapGetters } from "vuex"
export default {
  name: 'App',
  components: {
    HelloWorld
  },
  computed: {
    // counts() {
    //   return this.$store.state.count;
    // },
    // doubleCounts() {
    //   return this.$store.getters.doubleCount;
    // }

    // 以下是简写模式
    // ...mapState(["count"]),
    ...mapState({
      count: state =>  state.count ,
      counts: state =>  state.count ,
    }),
    ...mapGetters(["doubleCount"]),
  },
  methods: {
    // addCount() {
    //   this.$store.commit("addCount", 3);
    // },
    // asyncAddCount() {
    //   this.$store.dispatch("asyncAddCount")
    // }

    // 以下是简写模式
    // ...mapMutations(["addCount"]),
    // ...mapActions(["asyncAddCount"])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>