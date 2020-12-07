<template>
  <v-container>
        <v-row>
            <v-col>
                <h3>{{cls.title}} <v-btn text v-on:click="saveClassInfo()">Save</v-btn></h3>
                  <draggable v-model="classInfo" @start="drag=true" @end="drag=false">
                        <v-list-item v-for="(audio,i) in classInfo" :key="i">
                            <v-list-item-icon>
                                <v-icon>mdi-menu</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="audio.title"></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action v-if="audio.type =='folder'">
                                <v-btn v-if="audio.type =='folder'" icon v-on:click="setInfo(audio)">
                                    <v-icon>mdi-folder-open</v-icon>
                                </v-btn>
                            </v-list-item-action>
                            <v-list-item-action>
                                <v-btn icon v-on:click="showModal(i)">
                                    <v-icon>mdi-tooltip-edit</v-icon>
                                </v-btn>
                            </v-list-item-action>
                
                        </v-list-item>
                  </draggable>
                  <AudioModal v-on:updated-audio="updateInfo" />
            </v-col>
        </v-row>
  </v-container>
</template>

<script>
import AWS from 'aws-sdk'
import draggable from 'vuedraggable'
import AudioModal from '../components/AudioModal'
import { Buffer } from 'buffer';
export default {
    name:"TheClass",

    components:{
        draggable,
        AudioModal
    },

    data: () => ({
        s3 : new AWS.S3({
            region: 'ap-south-1',
            region: 'ap-south-1',
            accessKeyId: process.env.VUE_APP_AWS_ACCESS_ID,
            secretAccessKey: process.env.VUE_APP_AWS_ACCESS_KEY
            }),
        cls:{},
        classInfo:[],
        baseUrl:String,
        track:String,
        files:[],
        folders:[],
        selected:String,
        audioSrc:String,
    }),

    async mounted(){
        this.baseUrl = 'https://aurostorage181450-sriauro.s3.ap-south-1.amazonaws.com/'
        this.cls = this.$route.query.cls
        this.files = await this.getFiles(this.cls.key)
        this.folders = await this.getFolders(this.cls.key)
        this.classInfo = await this.getClassInfo(this.cls.key)
    },

    methods: {
        async getFiles(key){
            var params = {
                Bucket: 'aurostorage181450-sriauro', /* required */
                Prefix: key+'audio/'
            };
            let data = await this.s3.listObjectsV2(params).promise()
            return data.Contents
        },

        async getFolders(key){
            var params = {
                Bucket: 'aurostorage181450-sriauro', /* required */
                Prefix: key,
                Delimiter: '/'
            };
            let data = await this.s3.listObjectsV2(params).promise()
            //console.log(data);
            return data.CommonPrefixes.map(fol =>({
                key: fol.Prefix,
                title: fol.Prefix.split('/')[fol.Prefix.split('/').length - 2]
            }))
        },

        async getClassInfo(key){
            let info = []
            var par = {
                    Bucket: 'aurostorage181450-sriauro', /* required */
                    Key: key+'info.txt'
                }
            try{
                let data1 = await this.s3.getObject(par).promise()
                info = JSON.parse(new TextDecoder("utf-8").decode(data1.Body))
                if(this.files.length > 0){
                    let newFiles = this.files.filter(aud => !info.some(inf => aud.Key === inf.key))
                //console.log(newFiles)
                    if(newFiles.length > 0){
                        newFiles.forEach(f => {
                            if(f.Size > 0){
                                info.push({
                                key : f.Key,
                                title: f.Key.slice(f.Key.lastIndexOf('/') + 1),
                                shortDesc: '',
                                tags: '',
                                readingText: ''
                                })
                            }
                        })
                    }
                }
                else if(this.folders.length > 0){
                    let newFolders = this.folders.filter(fol => !info.some(inf => fol.key === inf.key))
                    if(newFolders.length > 0){
                        newFolders.forEach(f => {
                            info.push({
                                key: f.key,
                                title: f.title,
                                shortDesc: '',
                                tags: '',
                                type: 'folder',
                            })
                        })
                    }
                }
                return info
            }
            catch(e){
                if(e){
                    //console.log(e)
                    if(this.files.length > 0){
                        this.files.forEach(aud => {
                            if(aud.Size > 0){
                                info.push({
                                key : aud.Key,
                                title: aud.Key.slice(aud.Key.lastIndexOf('/') + 1),
                                shortDesc: '',
                                tags: '',
                                readingText: ''
                            })
                            }
                        })
                    }
                    else if(this.folders.length > 0){
                        this.folders.forEach(f =>{
                            info.push({
                                key: f.key,
                                title: f.title,
                                shortDesc: '',
                                tags: '',
                                type: 'folder'
                            })
                        })
                    }
                    return info
                }
            }
        },

        showModal(i){
            this.$modal.show('audio-modal', {item: this.classInfo[i], idx: i});
        },

        async setInfo(fol){
            this.cls.key = fol.key
            this.cls.title = fol.title
            this.files = await this.getFiles(fol.key)
            this.folders = await this.getFolders(fol.key)
            this.classInfo = await this.getClassInfo(fol.key)
            //console.log(this.classInfo)
        },

        updateInfo(e){
            this.classInfo[e.idx] = e.item
            this.$modal.hide('audio-modal')
        },

        saveClassInfo(){
            //console.log(this.classInfo)
            var param2 = {
                Body: JSON.stringify(this.classInfo), 
                Bucket: "aurostorage181450-sriauro", 
                Key: this.cls.key+"info.txt"
            }
            this.s3.putObject(param2, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else {
                    alert("Class Updated!")
                } 
            });
            
        }
        
    }
    
}
</script>

<style>

</style>