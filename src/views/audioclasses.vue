<template>

    <v-container class="grey lighten-5">
        <ClassModal v-on:updated-cls='clsup' />
        <h3>Audio Classes <v-btn text v-on:click="saveClasses">Save</v-btn></h3>
        <draggable v-model="classes" @start="drag=true" @end="drag=false">
            <v-list-item v-for="(cls,i) in classes" :key="i">
                <v-list-item-icon>
                    <v-icon>mdi-menu</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="cls.title"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-btn icon v-on:click="showModal(i)">
                        <v-icon>mdi-tooltip-edit</v-icon>
                    </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                    <v-btn icon v-on:click.native="goToClass(cls)">
                        <v-icon>mdi-arrow-right-bold-box</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </draggable>

        <h3>New Folders</h3>
        <ul v-if="folders">
            <li v-for="(item, i) in folders" :key="i" v-on:click="addClass(i)">
               <strong>{{ item.Prefix }}</strong>
            </li>
        </ul>
        <nested-draggable :tasks="classes" />
    </v-container>
</template>

<script>
//import {Storage} from 'aws-amplify'
import axios from 'axios'
import AWS from 'aws-sdk'
import { parse } from 'querystring'
import ClassModal from '../components/ClassModal'
import nestedDraggable from '../components/Nested'
import draggable from 'vuedraggable'
export default {

    name: 'audioclasses',
    components: {
      ClassModal: ClassModal,
      draggable,
      nestedDraggable
    },

    data: () => ({
        classes:[],
        folders:[],
        baseUrl:String,
        s3 : new AWS.S3({
            region: 'ap-south-1',
            accessKeyId: 'AKIA22ZVA64EUIBJ67FV',
            secretAccessKey: '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'
            })
            
    }),

    created(){
        this.getFolders()
        this.baseUrl = 'https://aurostorage181450-sriauro.s3.ap-south-1.amazonaws.com/public/'
        /* 
        let data = await axios.get('https://aurostorage181450-sriauro.s3.ap-south-1.amazonaws.com/public/audioclasses.txt')
        this.classes = data.data
        console.log(this.classes)
        */
    
    },

    methods: {
        async getFolders(){
            var params1 = {
            Bucket: "aurostorage181450-sriauro", 
            Prefix: "public/audioclasses/",
            Delimiter: '/'
            }
            let folderList = await this.s3.listObjectsV2(params1).promise()
            //console.log(folderList.CommonPrefixes)
            var par = {
                Bucket: "aurostorage181450-sriauro", 
                Key: "public/audioclasses.txt"
            }
            let info = await this.s3.getObject(par).promise()
            let string = JSON.parse(new TextDecoder("utf-8").decode(info.Body))

            let newFolders = folderList.CommonPrefixes.filter(function(fol){
                if(!string.some(f => fol.Prefix.includes(f.key))){
                    return fol
                }
            })
            this.folders = newFolders
            this.classes = string.map(st =>({...st, tasks:[]}))
            console.log(this.classes)
        },
        goToClass(cls){
            this.$router.push({ path: '/theclass', query: { cls } })
        },
        async addClass(i){
            var params1 = {
            Bucket: "aurostorage181450-sriauro", 
            Prefix: this.folders[i].Prefix,
            
            }
            let theFolder = await this.s3.listObjectsV2(params1).promise()
            console.log(theFolder) 
        },

        showModal(i){
            this.$modal.show('hello-world', {item: this.classes[i], idx: i});
        },
        clsup(e){
            this.classes[e.idx] = e.item
            console.log(this.classes)
            this.$modal.hide('hello-world')
        },

        saveClasses(){
            var param2 = {
                Body: JSON.stringify(this.classes), 
                Bucket: "aurostorage181450-sriauro", 
                Key: "public/audioclasses.txt"
            }
            this.s3.putObject(param2, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data); 
            });
            
           console.log(this.classes)
            
        }

    }
}
</script>

<style scoped>
.button {
  margin-top: 35px;
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}
.text {
  margin: 20px;
}
</style>