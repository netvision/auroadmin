<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-btn text color="deep-purple accent-4" @click.stop = "addQuote()"> Add New Quote  </v-btn>
            </v-col>
            <v-col v-for="(q, i) in quotes" :key="i" cols="12">
                <v-card shaped>
                <div class="d-flex flex-no-wrap justify-space-between">
                    <v-card-text v-html="q.content"></v-card-text>
                </div>
                <v-card-actions>
                    <v-btn text color="deep-purple accent-4" @click.stop = "editQuote(q)"> Edit  </v-btn>
                    <v-btn text color="deep-purple accent-4" @click.stop = "delQuote(q)"> Delete  </v-btn>
                </v-card-actions>
                </v-card>
            </v-col>
            <v-dialog v-model="dialog" max-width="600">
                <v-card>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <vue-editor v-model="quote.content" placeholder="Enter text here"></vue-editor>
                            </v-col>
                            <v-col cols="12">
                                <v-autocomplete :items="authors" item-text="name" item-value="id" label="author" v-model="quote.authorID"></v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="quote.ref" label="Source Referenece"></v-text-field>
                            </v-col>
                            <v-col><v-btn text color="deep-purple accent-4" @click = "saveQuote"> Save  </v-btn><v-btn text color="deep-purple accent-4" @click = "dialog=false"> Cancel</v-btn></v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import { API, graphqlOperation, input } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { VueEditor } from 'vue2-editor'
export default {
    name: "Quote",

    components:{
        VueEditor
    },

    data: () => ({
        dialog:false,
        authors:[],
        quotes:[],
        quote:{}
    }),

    async mounted(){
        const authors = await API.graphql(graphqlOperation(queries.listAuthors))
        console.log(authors.data.listAuthors.items)
        this.authors = authors.data.listAuthors.items
        const quotes = await API.graphql(graphqlOperation(queries.listPosts))
        this.quotes = quotes.data.listPosts.items
    },

    methods : {
        editQuote(q){
            this.quote = q
            this.dialog = true
        },

        addQuote(){
            this.quote = {}
            //this.quote = q
            this.dialog = true
        },

        async delQuote(q){
            if(confirm("Are you sure?")){
                const delQt = await API.graphql(graphqlOperation(mutations.deletePost, {input : {id : q.id}}))
                if(delQt){
                    this.quotes = this.quotes.filter( quote => quote.id != q.id)
                }
            }
        },

        async saveQuote(){
            console.log(this.quote)
            delete this.quote.author
            if(this.quote.id){
                const savedQt = await API.graphql(graphqlOperation(mutations.updatePost, {input : this.quote}))
            }
            else {
                const savedQt = await API.graphql(graphqlOperation(mutations.createPost, {input : this.quote}))
                this.quotes.unshift(savedQt.data.createPost)
            }
            //console.log(savedQt)
            this.dialog = false
        }
    }

}
</script>

<style>

</style>