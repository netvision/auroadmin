<template>
  <v-container>
      
          <v-row>
              <v-col cols="2">
                  <v-img :src="baseUrl+cls.key+cls.cover"></v-img>
              </v-col>
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
            accessKeyId: 'AKIA22ZVA64EUIBJ67FV',
            secretAccessKey: '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'
            }),
        cls:{},
        classInfo:[],
        baseUrl:String,
        track:String,
        files:[],
        selected:String,
        audioSrc:String,
        textFileName:String,
        textKey:String,
        content:"<h1>Some initial content</h1>"
    }),

    async mounted(){
        this.baseUrl = 'https://aurostorage181450-sriauro.s3.ap-south-1.amazonaws.com/public/'
        this.cls = this.$route.query.cls
        this.files = await this.getAudioFiles()
        this.classInfo = await this.getClassInfo()
        console.log(this.classInfo)
    },

    methods: {
        async getAudioFiles(){
            var params = {
                Bucket: 'aurostorage181450-sriauro', /* required */
                Prefix: this.cls.fullKey+'audio/',
            };
            let data = await this.s3.listObjectsV2(params).promise()
            return data.Contents
        },

        async getClassInfo(){
            let info = []
            var par = {
                    Bucket: 'aurostorage181450-sriauro', /* required */
                    Key: this.cls.fullKey+'classInfo.txt'
                }
            try{
                let data1 = await this.s3.getObject(par).promise()
                info = JSON.parse(new TextDecoder("utf-8").decode(data1.Body))
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
                return info
            }
            catch(e){
                if(e){
                    console.log(e)
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
                    return info
                }
            }
        },

        showModal(i){
            this.$modal.show('audio-modal', {item: this.classInfo[i], idx: i});
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
                Key: this.cls.fullKey+"classInfo.txt"
            }
            this.s3.putObject(param2, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else {
                    alert("Class Updated!")
                } 
            });
            
        }
        

        /*
        setTrack: function(){
            console.log(this.track)
            this.audioSrc = this.baseUrl+this.cls.key+'audio/'+this.track
            this.textFileName = this.track.slice(0, this.track.lastIndexOf('.')) + '.txt';
            this.textKey = this.baseUrl+this.cls.key+'text/'+this.textFileName
            this.getText(this.textKey)
            
        },

        saveText: function(){
            //console.log(this.content)
            Storage.put(this.cls.key+'text/'+this.textFileName, Buffer.from(this.content),  {
                level: 'public',
                contentType: 'text/html'
            }).then(res=>{
                alert('Text Update!')
            }).catch(err => {
                alert('Some Error Occured!' + err)
            })
        },

        getText: function(key){
            this.content = ''
            axios.get(key, { headers: { 'Cache-Control': 'no-cache' }}).then(res =>{
                this.content = res.data
                //console.log(this.content)
            }).catch(err =>{
                console.log(err);
                this.content = "Please enter text!"
            })
        }

        */
    }
    
}
</script>

<style>

</style>