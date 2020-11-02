<template>
    <modal name="audio-modal" @before-open="beforeOpen" height="auto" scrollable>
        <v-container>
            <v-card class="mx-auto" max-width="640" outlined>
                <v-card-text>
                    <h3 style="text-align:center; padding-bottom:30px">Edit Audio Info</h3>
                    <audio controls :src="audioSrc" style="width:100%" v-if="!file.type"></audio>
                    <v-text-field v-model="file.title" label="Title"></v-text-field>
                    <v-text-field v-model="file.shortDesc" label="Short Description"></v-text-field>
                    <vue-editor v-model="file.readingText" v-if="!file.type"></vue-editor>
                    <v-text-field v-model="file.tags" label="Tags (Comma Separated)"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn text v-on:click="saveInfo">Save</v-btn>
                    <v-btn text v-on:click="hideModal">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </modal>
</template>
<script>
import { VueEditor } from 'vue2-editor'
export default {
    name: 'AudioModal',
    components:{
        VueEditor
    },

    data: function () {
      return {
          baseUrl: String,
          idx: Number,
          file: Object,
          audioSrc: String,
      }
    },
    methods: {
      beforeOpen (event) {
        this.idx = event.params.idx
        this.file = event.params.item
        this.baseUrl = 'https://aurostorage181450-sriauro.s3.ap-south-1.amazonaws.com/'
        this.audioSrc = this.baseUrl+this.file.key
      },

      saveInfo(){
        this.$emit('updated-audio', {item: this.file, idx: this.idx})
      },

      hideModal(){
        this.$modal.hide('audio-modal')
      }
    }
}
</script>