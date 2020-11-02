<template>
  <v-container>
        <v-card>
            <v-card-text>Input</v-card-text>
            <div v-for="(item, i) in items" v-bind:key="i">
             <model-list-select :list="produceList"
                     v-model="item.produce"
                     option-value="id"
                     option-text="name"
                     placeholder="select produce"
                     @input="printProduce(item)">
              </model-list-select>
              <v-btn @click="addItem">Add</v-btn>
            </div>
            <modal name="addProduce">
                This is my first modal
            </modal>
            <v-btn @click="showModal">show modal</v-btn>
        </v-card>
  </v-container>
</template>

<script>
import { ModelListSelect } from 'vue-search-select';
import axios from 'axios';
export default {
    name: 'FarmInputForm',
    components:{
        ModelListSelect
    },
    data:()=>({
        produceList:[],
        items:[{
            produce:{},
        }],
    }),
    mounted(){
        axios.get('https://api.resurgentindia.org/farms/products').then(res =>{
          console.log(res.data)
          this.produceList = res.data
          this.produceList.unshift({id:0, name:'Add New'})
        })
    },
    methods:{
        addItem(){
            this.items.push({
            produce:{}
            })
        },
        addItem(){
        this.items.push({
          produce:{}
        })
      },

      showModal(){
        console.log(this.items)
        this.$modal.show('addProduce')
      },

      printProduce(item){
        if(item.produce.id == 0){
          this.$modal.show('addProduce')
        }
        console.log(this.items)
      }
    }

}
</script>

<style>

</style>