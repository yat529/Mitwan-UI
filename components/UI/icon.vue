<template>
  <i :class="classNames" :style="style" :data-fa-transform="faPowerTransform"></i>
</template>

<script>
export default {
  props: {

    // Fontawesome Icon names
    faName: {
      type: String,
      require: true
    },

    // Fontawesome styling classes
    faStyleClass: {
      type: String,
      require: false
    },

    // Fontawesome Power Transforms
    faPowerTransform: {
      type: String,
      require: false
    },

    // Specific styles
    // Ex: { background: 'white', color: 'black' }
    styles: {
      type: Object,
      require: false
    },

    // Specify font color
    color: {
      type: String,
      required: false,
      default: 'black'
    }

  },

  computed: {
    classNames () {
      return this.faName + ' ' + this.faStyleClass
    },

    style () {
      let styleCSS = ''

      // if style object is specified
      if (this.styles && typeof this.styles === 'object') {
        Object.keys(this.styles).forEach(key => {
          styleCSS += `${key}: ${this.styles[key]};`
        })
      }

      // if font color is specified
      if (this.color) {
        styleCSS += `color: ${this.color};`
      }
      
      return styleCSS
    }
  },
}
</script>

