<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
     <button @click="addCount(2)">addCount</button>
    <br />
    <button @click="asyncAddCount">asyncAddCount</button>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex"

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    // addCount() {
    //   this.$store.commit("addCount", 3);
    // },
    // asyncAddCount() {
    //   this.$store.dispatch("asyncAddCount")
    // }

    // 以下是简写模式
    ...mapMutations(["addCount"]),
    ...mapActions(["asyncAddCount"])
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
