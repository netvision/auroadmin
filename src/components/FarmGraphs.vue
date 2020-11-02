<template>
    <v-card>
        <v-row>
            <v-col>
                <v-select v-model="month" :items="months" item-text="name" item-value="id" label="Select Month"></v-select>
            </v-col>
            <v-col>
                <v-select v-model="year" :items="['2019', '2020']" label="Select Year"></v-select>
            </v-col>
            <v-col>
                <v-btn @click="getFarmData">Get Data</v-btn>
            </v-col>
            </v-row>
            <div style="height:400px; width:90%">
                <IEcharts :option="daily" :loading="loading1" />
            </div>
            <div style="height:400px; width:90%">
              <IEcharts :option="bar" :loading="loading" @ready="onReady" @click="onClick" />
            </div>
          </v-card>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/full.js';
import axios from 'axios';
export default {
    name:'FarmGraphs',
    components: {
        IEcharts
    },
    data:()=>({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        months:[{name: 'January', id: '01'}, {name: 'February', id: '02'}, {name: 'March', id: '03'}, {name: 'April', id: '04'},{name: 'May', id: '05'}, {name: 'June', id: '06'}, {name: 'July', id: '07'}, {name: 'August', id: '08'}, {name: 'September', id: '09'},{name: 'October', id: '10'}, {name:"November", id: '11'}, {name:"December", id: '12'}],
        loading: true,
        loading1: true,
        bar: {
            title: {
                text: 'Monthly data'
            },
            tooltip: {
                formatter: function (params, ticket, callback) {
                return params.name+': '+params.data+'Kg';
                }
            },
            xAxis: {
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May','jun','Jul','Aug','Sep','Oct','Nov','Dec']
            },
            yAxis: {
                type:'value',
                name: "In Kg",
                nameGap:10
            },
            series: [{
                name: 'monthly',
                type: 'bar',
                data: []
            }]
        },
        daily: {
            title: {
                text: 'Daily data'
                },
            tooltip: {},
            xAxis: {
                data: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
            },
            yAxis: {
                type:'value',
                name: "In Kg",
                nameGap:10},
            series: [{
                name: 'daily',
                type: 'bar',
                data: []
            }]
        }
    }),
    methods: {
        async getFarmData() {
            const that = this;
            let record = await axios.get('https://api.resurgentindia.org/farms/summary', {params: {month:this.month, year: this.year}});
            that.loading = false;
            that.loading1 = false;
            that.bar.series[0].data = record.data.monthly;
            that.daily.series[0].data = record.data.daily;
            that.daily.title.text = "Daily Data for the "+that.months[that.month - 1].name+" of "+that.year;
            that.bar.title.text = "Monthly data for "+that.year;
            that.daily.tooltip.triggerOn = 'click';
            that.daily.tooltip.formatter = function(params, ticket, callback){
                let day = params.dataIndex + 1;
                //console.log(params)
                axios.get('https://api.resurgentindia.org/farms/daily?record_date='+that.year+'-'+that.month+'-'+day).then(res =>{ 
                    callback(ticket, that.dataFormat(res.data, params))
                });
                return "Loading data..."
            };
        },

      dataFormat(d, p){
          let day = parseInt(p.dataIndex) + 1
          let mnt = this.months.filter(m => m.id == this.month)
          let string = '<table>'
          string += '<tr><th colspan="2">'+mnt[0].name+' '+day+', '+this.year+'</th></tr>'
          d.forEach(r =>{
              string += '<tr><td>'+r.name+'</td><td style="text-align:right; padding-left:10px">'+r.qty+'Kg</td></tr>'
          })
          string += '<tr><td colspan="3" style="text-align:right">Total '+p.data+'Kg</td></tr></table>'
          return string
      },

      onReady(instance, ECharts) {
      },
      onClick(event, instance, ECharts) {
        //console.log(instance);
      },
    }
}
</script>

<style>

</style>