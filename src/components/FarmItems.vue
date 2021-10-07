<template>
    <v-container>
      <modal name="addProduce" style="z-index:20000">
          <v-container>
            <h3>Add New Item</h3>
            <v-row>
              <v-col><v-text-field v-model="newItem.name" ref="itemName" label="Name" autofocus></v-text-field></v-col>
              <v-col><model-select :options="categories" v-model='newItem.category' placeholder="select category"></model-select></v-col>
              <v-col><model-select :options="types" v-model='newItem.type' placeholder="select Type"></model-select></v-col>
            </v-row>
            <v-row>
              <v-col><v-text-field v-model="newItem.other_info" label="Other Info"></v-text-field></v-col>
            </v-row>
            <v-btn @click="addNewItem" text>Save</v-btn>
          </v-container>
       </modal>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Farm Items</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" @click="showModal">Add New Item</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import { ModelSelect } from 'vue-search-select';
import axios from 'axios';
export default {
    name: "FarmItems",
    components:{
        ModelSelect
    },
    data: () =>({
        items:[],
        newItem:{name: '', type: '', category:'', other_info:''},
        types:[{value:'Vegitable', text:'Vegitable'}, {value: 'Fruit', text:'Fruit'}, {value: 'Grain', text: 'Grain'}, {value: 'Flowers', text: 'Flowers'}, {value: 'Other', text: 'Other'}],
        categories:[{value: 'Winter', text: 'Winter'}, {value: 'Summer', text: 'Summer'}, {value: 'Other', text: 'Other'} ],
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Category', value: 'category' },
          { text: 'Type', value: 'type' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
    }),
    mounted(){
        this.initialize()
    },
    methods:{
        showModal(){
            this.newItem = {}
            this.$modal.show('addProduce')
        },
        initialize(){
            axios.get('https://api.resurgentindia.org/farms/products').then(res =>{
            this.items = res.data
            })
        },
        editItem(item){
            this.newItem = item
            this.$modal.show('addProduce')
            console.log(this.newItem)
        },
        addNewItem(){
            if(!this.newItem.id){
                axios.post('https://api.resurgentindia.org/farm-produces', this.newItem).then(res =>{
                    if(res.status == '201'){
                        this.items.unshift(res.data);
                    }
                    else alert('could not add the new item!')
                })
            }
            else{
                this.newItem.other_info = (this.newItem.other_info == '') ? 'info' : this.newItem.other_info 
                axios.put('https://api.resurgentindia.org/farm-produces/'+this.newItem.id, this.newItem).then(res =>{
                    if(res.status == '200'){
                        console.log(res.data)
                    }
                    else alert('could not add the new item!')
                })
            }
            this.$modal.hide('addProduce')
        }
    }
}
</script>

<style>

</style>