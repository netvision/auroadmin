<template>
  <v-container>
    <v-carousel hide-delimiters cycle interval = "5000" progress>
      <v-carousel-item v-for="(item,i) in articles" :key="i" :src="item.media_url" reverse-transition="fade-transition" transition="fade-transition">
        <div class="carausel_caption">{{item.title.rendered}}</div>
      </v-carousel-item>
    </v-carousel>
    <v-list>
      <v-list-item v-for="(art, i) in wpArticleList" :key="i">
        <h3 v-html="art.node.title"></h3>
        <div v-html="art.node.excerpt"></div>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import {Storage} from 'aws-amplify'
import { Buffer } from 'buffer';
import axios from 'axios'
import allWordPressPost from '../assets/index.json'
import GhostContentAPI from '@tryghost/content-api'
//import { Carousel3d, Slide } from 'vue-carousel-3d';

export default {
  name: 'Home',
  components: {
    
  },

  data: () => ({
    wpArticleList:[],
    articles: [],
    api : new GhostContentAPI({
      url: 'https://ghost.resurgentindia.org',
      key: 'efa7aa0eb14a3c14fc1678b914',
      version: "v3"
    })
  }),

  mounted(){
    this.getArticles();
    this.wpArticleList = allWordPressPost.data.allWordPressPost.edges;
    this.getGhostArticles();
    //console.log(this.wpArticleList);
  },

  methods: {
    async getArticles(){
      let options = {
      //observe: "response" as 'body',
      params: {
        per_page: '15',
        //page: ''+page,
        tags_exclude: '77'
        }
      };
      let data = await axios.get('https://new.resurgentindia.org/wp-json/wp/v2/posts?_embed', options)
      
      for (let post of data.data) {
          post.media_url = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['medium'].source_url;
        }
      this.articles = data.data
      //console.log(this.articles)
    },

    async getGhostArticles(){
      let arts = await this.api.posts.browse({filter:'tag:china', fields:'html'})
      console.log(arts)
    }

  }

} 
</script>
<style scoped>
  .carausel_caption{
    position: absolute;
    bottom: 30px;
    left: 10px;
    font-size: 1.5rem;
    color: aliceblue;
    background-color:steelblue;
    text-align: center;
  }
</style>
