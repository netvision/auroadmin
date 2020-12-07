<template>
<v-app>
  <v-app-bar app absolute color="white" elevate-on-scroll dense height="40px">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>Resurgent India</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">
        Home
      </v-btn>
      
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" temporary>
      <v-btn text v-if="!signedIn" to="/auth">Login</v-btn>
      <v-list nav dense v-if="signedIn">
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item>
            <v-btn text to="/studysessions">
              Audio Classes
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn text to="/quote">
              Quotations
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn text to="/farm">
              Farm Produce
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn text @click="signOut">
              Logout
            </v-btn>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  
  <!-- Sizes your content based upon application components -->
  <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
      
    </v-container>
  </v-content>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>

</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue'
import { Auth } from 'aws-amplify'

export default {
  name: 'App',
  data() {
    return {
      drawer: false,
      signedIn: false
    }
  },
  beforeCreate() {
    AmplifyEventBus.$on('authState', info => {
      if (info === 'signedIn') {
        this.signedIn = true
        this.$router.push('/profile')
      }
      if (info === 'signedOut') {
        this.$router.push('/auth')
        this.signedIn = false
      }
    });

    Auth.currentAuthenticatedUser().then(user => {
        //console.log(user)
        this.signedIn = true
      }).catch(() => this.signedIn = false)
  },

  methods: {
    async signOut(){
      await Auth.signOut()
      this.$router.push('/auth')
    }
  }
  /*
  components: {
    //HelloWorld
  },

  data: () => ({
      drawer: false,
    }),

  methods: {
    goTo(path){
      this.$router.push(path)
    }
  }
  */

}
</script>
<style>
</style>
