<template>

    <v-container class="grey lighten-5">
        <ClassModal v-on:updated-cls='clsup' />
        <h3>Root Folders <v-btn text v-on:click="saveRootInfo">Save</v-btn></h3>
        <draggable v-model="rootInfo" @start="drag=true" @end="drag=false">
            <v-list-item v-for="(cls,i) in rootInfo" :key="i">
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
                    <v-btn icon v-on:click="goToClass(cls)">
                        <v-icon>mdi-folder-open</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </draggable>
        
    </v-container>
</template>

<script>
import AWS from 'aws-sdk'
import draggable from 'vuedraggable'
import ClassModal from '../components/ClassModal'
export default {
    name: 'studySession',
    components: {
        draggable,
        ClassModal
    },
    data: () =>({
        folders: [],
        rootInfo: [],
        baseUrl:String,
        s3 : new AWS.S3({
            region: 'ap-south-1',
            accessKeyId: process.env.VUE_APP_AWS_ACCESS_ID,
            secretAccessKey: process.env.VUE_APP_AWS_ACCESS_KEY
            })
    }),
    async mounted(){
        this.folders = await this.getRootFolders()
        this.rootInfo = await this.getRootInfo()
    },

    methods: {
        async getRootFolders(){
            var params1 = {
            Bucket: "aurostorage181450-sriauro", 
            Prefix: "public/StudyClasses/",
            Delimiter: '/'
            }
            let folderList = await this.s3.listObjectsV2(params1).promise()
            return folderList.CommonPrefixes
            /*
            var par = {
                Bucket: "aurostorage181450-sriauro", 
                Key: "public/StudyClasses/info.txt"
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
            */
        },

        showModal(i){
            this.$modal.show('hello-world', {item: this.rootInfo[i], idx: i});
        },
        clsup(e){
            this.rootInfo[e.idx] = e.item
            console.log(this.rootInfo)
            this.$modal.hide('hello-world')
        },

        goToClass(cls){
            this.$router.push({ path: '/theclass', query: { cls } })
        },

        async saveRootInfo(){
            var param2 = {
                Body: JSON.stringify(this.rootInfo), 
                Bucket: "aurostorage181450-sriauro", 
                Key: "public/StudyClasses/info.txt"
            }
            this.s3.putObject(param2, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     alert('Root Folder Information Updated!'); 
            });
        },

        async getRootInfo(){
            let info = []
            var par = {
                    Bucket: 'aurostorage181450-sriauro', /* required */
                    Key: 'public/StudyClasses/info.txt'
                }
            try{
                let data1 = await this.s3.getObject(par).promise()
                 
                info = JSON.parse(new TextDecoder("utf-8").decode(data1.Body))
                let newFiles = this.folders.filter(fol => !info.some(inf => fol.Prefix === inf.key))
                //console.log(newFiles)
                if(newFiles.length > 0){
                    newFiles.forEach(f => {
                        info.push({
                        key : f.Prefix,
                        title: f.Prefix.split('/')[f.Prefix.split('/').length - 2],
                        shortDesc: '',
                        tags: ''
                        })
                        
                    })
                }
                return info
                
            }
            catch(e){
                if(e){
                    console.log(e)
                    this.folders.forEach(fol => {
                        let path = fol.Prefix.split('/')
                        info.push({
                            key : fol.Prefix,
                            title: path[path.length -2],
                            shortDesc: '',
                            tags: ''
                        })
                    })
                    return info
                }
            }
        }
    }
}

</script>

<style scoped>

</style>