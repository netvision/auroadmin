<template>
  
  <div class="echarts">
    <v-toolbar color="cyan" dark flat>
      
      <v-toolbar-title>Farm Produce</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-slot:extension>
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab>Records</v-tab>
          <v-tab>Items</v-tab>
          <v-tab>Graphs</v-tab>
          <v-tab>Reports</v-tab>
        </v-tabs>
      </template>
      
    </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item> <FarmInputForm /> </v-tab-item>
        <v-tab-item> <FarmItems /> </v-tab-item>
        <v-tab-item> <FarmGraphs /> </v-tab-item>
        <v-tab-item> <FarmReport /> </v-tab-item>
      </v-tabs-items>
    
    
  </div>
</template>

<script type="text/babel"> 
  import FarmInputForm from '../components/FarmInputForm';
  import FarmGraphs from '../components/FarmGraphs';
  import FarmReport from '../components/FarmReport';
  import FarmItems from '../components/FarmItems';
  export default {
    name: 'farmDataChart',
    components: {
      FarmInputForm,
      FarmGraphs,
      FarmReport,
      FarmItems
    },
    data: () => ({
     tab: null,
    }),
    
  };
</script>

<style scoped>
  
</style>