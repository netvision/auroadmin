<template>
  <modal name="hello-world" @before-open="beforeOpen" height="auto" scrollable>
    <v-container>
    <v-card class="mx-auto" max-width="540" outlined>
      <v-card-text>
        <h3 style="text-align:center; padding-bottom:30px">Edit Class Info</h3>
        <p>
          <v-text-field v-model="cls.title" label="Title"></v-text-field>
        </p>
        <p>
          <v-text-field v-model="cls.shortDesc" label="Description"></v-text-field>
        </p>
        <p>
          <v-text-field v-model="cls.tags" label="Tags (Comma Separated)"></v-text-field>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn text v-on:click="saveClass">Save</v-btn>
        <v-btn text v-on:click="hideModal">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    </v-container>
  </modal>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: function () {
      return {
          idx: Number,
          cls: Object
      }
    },

  methods: {
      beforeOpen (event) {
        this.idx = event.params.idx
        this.cls = event.params.item
      },

      saveClass(){
        this.$emit('updated-cls', {item: this.cls, idx: this.idx})
      },

      hideModal(){
        this.$modal.hide('hello-world')
      }
    }
  }
</script>