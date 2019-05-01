<template>
  <div id="app" :style="style">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      style: ''
    }
  },
  created() {
    let width = window.screen.width;
    let height = window.screen.height;
    this.style = 'width: ' + width + "px; height: " + height + "px;"

    this.$router.push('/login')
  }
}
</script>

<style>
  body {
    margin: 0;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
