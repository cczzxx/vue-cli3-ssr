<template>
  <div class="home">
    {{msg}}
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data() {
    return {
      msg: 123
    }
  },
  components: {
    HelloWorld
  },
  created() {
    this.msg = 456;
  },
  mounted() {
    this.msg = 789;
  }
}
</script>
