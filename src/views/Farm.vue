<template>
  
  <div class="echarts">
    <v-toolbar color="cyan" dark flat>
      
      <v-toolbar-title>Farm Produce</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-slot:extension>
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab>Input</v-tab>
          <v-tab>Graphs</v-tab>
          <v-tab>Reports</v-tab>
        </v-tabs>
      </template>
      
    </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <FarmInputForm />
        </v-tab-item>
        <v-tab-item>
          <FarmGraphs />
        </v-tab-item>
        <v-tab-item>
          <v-card>
            
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    
    
  </div>
</template>

<script type="text/babel"> 
  import FarmInputForm from '../components/FarmInputForm';
  import FarmGraphs from '../components/FarmGraphs';
  export default {
    name: 'farmDataChart',
    components: {
      FarmInputForm,
      FarmGraphs
    },
    data: () => ({
     tab: null,
    })
  };
</script>

<style scoped>
  
</style>