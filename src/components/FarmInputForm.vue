<template>
  <v-container>
      
      <v-card>
        
      <v-data-table :headers="headers" :items="todaysRecords" class="elevation-1">
      <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title><v-btn @click="lastRecords" text>Last 10 Records</v-btn> | 
          <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">Show Records of {{date}}</v-btn>
            </template>
            <v-date-picker v-model="date" no-title @input="getData"></v-date-picker>
          </v-menu></v-toolbar-title>
        
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> New Entry </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="editedItem.record_date" label="Date" prepend-icon="event" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="editedItem.record_date" @input="menu2 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <model-list-select :list="produceList" v-model="editedItem.produce" option-value="id" option-text="name" placeholder="select produce"></model-list-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.quantity" label="Qty (Kg)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <model-list-select :list="farmHouses" v-model="editedItem.farmHouse" option-value="id" option-text="name" placeholder="select source"></model-list-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.destination" label="Destination"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
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
        farmHouses:[],
        newItem:{},
        menu2: false,
        menu1: false,
        date: new Date().toISOString().substr(0, 10),

        dialog: false,
        dialogDelete: false,
        headers: [
          {
            text: 'Date',
            align: 'start',
            sortable: false,
            value: 'record_date',
          },
          { text: 'Item', value: 'produce.name' },
          { text: 'Quantity (Kg)', value: 'quantity' },
          { text: 'Source', value: 'farmHouse.name' },
          { text: 'Destination', value: 'destination' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
          date: '',
          produce: {},
          quantity: 0,
          farmHouse: {},
          destination: '',
          remark: ''
        },
        defaultItem: {
          date: '',
          produce: {},
          quantity: 0,
          farmHouse: {},
          destination: '',
          remark: ''
        },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Entry' : 'Edit Record'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    mounted(){
       this.initialize()
    },
    methods:{
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
         
        },

        getData(){
          axios.get('https://api.resurgentindia.org/farms?expand=farmHouse,produce&sort=-id&record_date='+this.date).then(res=>{
            this.todaysRecords = res.data.data
          })
          this.menu1= false
        },
        lastRecords(){
          axios.get('https://api.resurgentindia.org/farms?expand=farmHouse,produce&sort=-id&per-page=10').then(res=>{
            this.todaysRecords = res.data.data
          })
          this.date = new Date().toISOString().substr(0, 10)
        },


        //
        initialize () {
          axios.get('https://api.resurgentindia.org/farms/products').then(res =>{
            this.produceList = res.data
          })
          axios.get('https://api.resurgentindia.org/farm-houses').then(res =>{
            this.farmHouses = res.data
          })
          axios.get('https://api.resurgentindia.org/farms?expand=farmHouse,produce&sort=-id&per-page=10').then(res=>{
            this.todaysRecords = res.data.data
          })
          this.date = new Date().toISOString().substr(0, 10)
          
      },

      editItem (item) {
        console.log(item)
        this.editedIndex = this.todaysRecords.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.todaysRecords.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        axios.delete('https://api.resurgentindia.org/farms/'+this.editedItem.id).then(res=>{
              if(res.status == '204'){
                this.initialize()
              }
              else alert('Couldnt delete the record!!')
            })
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        let record = {
            record_date:this.editedItem.record_date,
            produce_id: this.editedItem.produce.id,
            quantity: this.editedItem.quantity,
            qty_unit: 'Kg',
            farm_house_id: this.editedItem.farmHouse.id,
            destination: this.editedItem.destination,
            remark:(this.editedItem.remark) ? this.editedItem.remark : ' '
          };
        console.log(this.editedItem)
        if (this.editedIndex > -1) {
          axios.put('https://api.resurgentindia.org/farms/'+this.editedItem.id, record).then(res=>{
            this.initialize()
          })
        } else {
          axios.post('https://api.resurgentindia.org/farms', record).then(res=>{
            this.initialize()
          })
        }
        this.close()
      },
        
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

#inputForm{
  border: 2px solid #333;
  margin-bottom: 10px;
}

</style>