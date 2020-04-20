<template>
  <div id="app">
    <nav-bar v-if="hasToken"></nav-bar>
    <router-view/>
  </div>
</template>

<script>
    import NavBar from '@/components/NavBar.vue'
    export default {
        name: 'app',
        components: {
            'nav-bar': NavBar
        },
        mounted() {
            // console.log("mounted")
            setTimeout(() => {
                if (this.$route.name != "login") {
                    this.$store.dispatch({
                        type: 'checkSignIn'
                    })
                }
            }, 2000)
            
        },
        computed: {
            hasToken() {
                return this.$store.getters.hasToken
            }
        }
    }
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
