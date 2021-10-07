<template>
  <v-container>
      <h2>Generate Reports</h2>
      <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px" >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">{{date | formatDate}}</v-btn>
          </template>
          <v-date-picker v-model="date" type="month" no-title @input="getData" ></v-date-picker>
        </v-menu>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
    name: "FarmReport",
    data: vm => ({
      date: new Date().toISOString().substr(0, 7),
      menu1: false,
      farmHouses:[],
      farmReport:[]
    }),

    methods: {
       getData(){
          this.farmHouses.forEach(f =>{
                axios.get('https://api.resurgentindia.org/farms/monthly?farm_id='+f.id+'&month='+this.date.substr(5,2)+'&year='+this.date.substr(0,4)).then(res =>{
                this.farmReport.push(res.data)
              })
            })
            console.log(this.farmReport)
            this.menu1 = false
          }
      
    },

    created(){
        axios.get('https://api.resurgentindia.org/farm-houses').then(res => {
            this.farmHouses = res.data
            console.log(this.farmHouses)
        })
        
    }
}
</script>

<style>

</style>