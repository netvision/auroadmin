<template>
  <v-container>
       
        <v-card id="inputForm">
            <v-card-title>Add New Record</v-card-title>
              <v-row>
                <v-col cols="6" sm="3" md="2">
                  <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="item.date" label="Date" prepend-icon="event" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="item.date" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <model-list-select :list="produceList" v-model="item.produce" option-value="id" option-text="name" placeholder="select produce" @input="printProduce(item)"></model-list-select>
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="item.quantity" label="Quantity" suffix="Kg"></v-text-field>
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <v-select v-model='item.source' :items="farmHouses" item-text="name" item-value="id" label="Select Source"></v-select>
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="item.destination" label="Destination"></v-text-field>
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="item.remark" label="Remark, if any"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col><v-btn @click="addRecord" text>Add Record</v-btn></v-col>
              </v-row>
            <modal name="addProduce">
                <v-container>
                <h3>Add New Item</h3>
                <v-row>
                  <v-col><v-text-field v-model="newItem.name" label="Name"></v-text-field></v-col>
                  <v-col><v-select v-model='newItem.category' :items="categories" label="Category"></v-select></v-col>
                  <v-col><v-select v-model='newItem.type' :items="types" label="Type"></v-select></v-col>
                </v-row>
                <v-row>
                  <v-col><v-text-field v-model="newItem.other_info" label="Other Info"></v-text-field></v-col>
                </v-row>
                <v-btn @click="addNewItem" text>Save and select</v-btn>
                </v-container>
            </modal>
           
        </v-card>
      <v-card>
        <v-card-title>last 10 Records</v-card-title>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr><th class="text-left">Date</th><th class="text-left">Item</th><th>Quantity</th><th>Source</th><th>Destination</th><th>Action</th></tr>
            </thead>
            <tbody>
          <tr v-for="record of todaysRecords" :key="record.id">
            <td>{{record.record_date}}</td><td>{{record.produce.name}}</td><td>{{record.quantity}} Kg</td><td>{{record.farmHouse.name}}</td><td>{{record.destination}}</td><td><v-btn icon color="red" @click="deleteRecord(record)"><v-icon>mdi-delete</v-icon></v-btn></td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
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
        todaysRecords:[],
        produceList:[],
        item:{
            produce:{},
            date: new Date().toISOString().substr(0, 10),
        },
        categories:['Vegitable', 'Fruit', 'Grain', 'Flowers'],
        types:['Winter', 'Summer'],
        farmHouses:[],
        newItem:{},
        menu2: false,
    }),
    mounted(){
        axios.get('https://api.resurgentindia.org/farms/products').then(res =>{
          this.produceList = res.data
          this.produceList.unshift({id:0, name:'Add New'})
        })
        axios.get('https://api.resurgentindia.org/farm-houses').then(res =>{
          this.farmHouses = res.data
        })
        axios.get('https://api.resurgentindia.org/farms?expand=farmHouse,produce&sort=-id&per-page=10').then(res=>{
          this.todaysRecords = res.data.data
        })
    },
    methods:{
        addItem(){
            this.items.push({
            produce:{}
            })
        },

        showModal(){
          console.log(this.item)
          this.$modal.show('addProduce')
        },

        printProduce(item){
          if(item.produce.id == 0){
            this.$modal.show('addProduce')
          }
        //console.log(this.items)
        },

        addNewItem(){
          axios.post('https://api.resurgentindia.org/farm-produces', this.newItem).then(res =>{
            if(res.status == '201'){
              this.produceList.push(res.data);
              this.item.produce = res.data;
            }
            else alert('could not add the new item!')
          });
          this.$modal.hide('addProduce')
        },

        addRecord(){
          let record = {
            record_date:this.item.date,
            produce_id: this.item.produce.id,
            quantity: this.item.quantity,
            qty_unit: 'Kg',
            farm_house_id: this.item.source,
            destination: this.item.destination,
            remark:(this.item.remark) ? this.item.remark : ' '
          };
          axios.post('https://api.resurgentindia.org/farms', record).then(res=>{
            let newRecord = res.data;
            newRecord.produce = this.produceList.find(produce => produce.id === newRecord.produce_id)
            newRecord.farmHouse = this.farmHouses.find(farmHouse => farmHouse.id === newRecord.farm_house_id)
            this.todaysRecords.unshift(newRecord);
            console.log(this.todaysRecords)
          })
        },

        deleteRecord(r){
          if(confirm('Are you sure?')){
            axios.delete('https://api.resurgentindia.org/farms/'+r.id).then(res=>{
              if(res.status == '204'){
                const index = this.todaysRecords.findIndex(rec => rec.id === r.id);
                this.todaysRecords.splice(index, 1);
              }
              else alert('Couldnt delete the record!!')
            })
          }
         
        }
        
      }
}
</script>

<style>
#inputForm .ui.selection.dropdown{
  border: none;
  border-bottom: 1px solid #333;
  border-radius:0%;
  margin-top: 0.9em;
}

</style>