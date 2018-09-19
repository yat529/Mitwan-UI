<template>
  <div>
    <div class="mt-select" :class="hasError ? 'error' : ''" ref="taWrapper">
      <div class="label" ref="label">{{ label }}</div>
      <div class="mt-select-input" @click="focus" ref="selectInput">{{ content }}</div>
      <ul class="mt-select-items" v-show="showSelection" v-click-outside="hideListOnClickOutside">
        <li @click="select(null)">不选择</li>
        <li v-for="(item, index) in items" :key="index" @click="select(item)">{{ item }}</li>
      </ul>
      <div class="carret"></div>
      <div class="icon">
        <span class="required-label" v-if="showRequiredIcon">{{ requiredMsg }}</span>
        <checkIcon :width="15" :height="15" v-else-if="showCheckIcon"></checkIcon>
      </div>
      <div class="underline" ref="underline"></div>
    </div>
    <div class="mt-select-meta" :class="hasError && !persistentHint ? 'error' : ''">
      <div class="hint" v-if="hasError || hint">
        {{ hasError && !persistentHint ? errorMsg : hint }}
      </div>
    </div>
  </div>
</template>

<script>
import checkIcon from '@/components/icons/check_icon'

export default {
  components: {
    checkIcon
  },

  props: {
    // Input label Text
    label: {
      type: String,
      require: true
    },

    // Selection Items
    items: {
      type: Array,
      require: true
    },

    // Input is required or not
    // Check on blur event, report error if no input content
    required: {
      type: Boolean,
      require: false
    },

    // Hint message
    // will be overwrite if error message exists
    hint: {
      type: String,
      require: false
    },

    // Persistent hint
    // error message will not overwrite hint
    persistentHint: {
      type: Boolean,
      require: false
    },

    // Toggle validation check icon
    validationCheckIcon: {
      type: Boolean,
      require: false
    },
  },

  data () {
    return {
      // Input Content
      content: '',

      // toggle selection list
      showSelection: false,

      // used to check if required error
      // @ hasRequiredError (computed prop)
      requiredError: false,

      // On blur event, validated if no error
      // reset to false on focus event
      // $emit to parenet component
      validated: false,
    }
  },

  computed: {

    /* 
    ** Error Control
    */

    hasError () {
      return this.hasRequiredError
    },

    errorMsg () {
      if (this.hasRequiredError) {
        return this.requiredMsg
      }
    },

    /* 
    ** Reuiqred Input
    */

    // Required Message
    // what to show in the indicator box
    // @ template
    requiredMsg () {
      if (this.required) return '必选'
    },

    // check if required error exists
    hasRequiredError: {
      get () {
        return this.required && this.requiredError
      },

      set (newVal) {
        this.requiredError = newVal
      }
    },

    /* 
    ** Icon Control
    */
    showRequiredIcon () {
      return this.required && !this.validated
    },
    showCheckIcon () {
      return this.validationCheckIcon && this.validated
    },

  },

  watch: {
    content (newVal, oldVal) {
      // remove required error when typed
      if(newVal) {
        this.$refs.label.classList.add('moving')
        this.$refs.underline.classList.add('grow')

        // after 200ms remove grow class
        setTimeout(() => {
          this.$refs.underline.classList.remove('grow')
        }, 200)
      }
    }
  },

  methods: {
    hideListOnClickOutside (e) {
      if (e.target !== this.$refs.selectInput && this.showSelection) {
        this.showSelection = false
      }
    },

    focus () {
      // open selection list
      this.showSelection = true
      // reset validated
      this.validated = false
    },

    select (item) {
      this.content = item ? item : ''

      // reset require error
      this.hasRequiredError = false

      // set required error if clicked, but not typed
      if (!this.content) {
        if (this.required) this.hasRequiredError = true
        this.$refs.label.classList.remove('moving')
      }

      if (!this.hasError) {
        this.validated = true

        // report to parenet component
        this.$emit('blured', this.validated)
      }

      this.showSelection = false
    },

    // clear the error styles
    resetError () {
      this.requiredError = false
      this.validated = false
    },

    // clear input content and clear error styles
    resetInput () {
      this.content = ''
      this.resetError()
    },
  }
}
</script>



<style lang="scss" scoped>
@import '~assets/style/color';

$easing: cubic-bezier(0.25, 0.46, 0.45, 0.94); 

.mt-select {
  position: relative;
  width: 100%;
  padding-top: 20px;

  /* 
  ** Error State
  */
  &.error {
    .label {
      color: $error;

      &.moving {
        color: $error;
      }
    }
    .underline {
      background-color: $error;

      &::after {
        background-image: linear-gradient(to right, $error, lighten($error, 15%));
      }
    }
  }

  .label {
    display: block;
    position: absolute;
    top: 20px;
    left: 0px;
    font-size: 0.9rem;
    color: $fontColorLight;
    line-height: 35px;
    transform: translateY(0px);
    transform-origin: left;
    transition: all 0.2s $easing;

    &.moving {
      color: $primary;
      transform: translateY(-22px) scale(0.8);
    }
  }

  .mt-select-input {
    position: relative;
    padding: 9px 0px;
    width: 100%;
    height: 35px;
    font-size: 0.9rem;
    color: $fontColor;
    overflow: hidden;
  }

  .mt-select-items {
    position: absolute;
    top: 20px;
    left: 0px;
    right: 0px;
    max-height: 150px;
    padding: 0px;
    margin: 0px;
    list-style-type: none;
    background: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    overflow-y: scroll;
    z-index: 2;

    li {
      padding: 10px 10px;
      margin: 0px;
      font-size: 0.9rem;
      color: $fontColorLight;
      text-align: left;
      border-bottom: 1px solid #eeeeee;
      list-style-type: none;

      &:last-child {
        border-bottom: 1px solid transparent;
      }
    }
  }

  .underline {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 1px;
    background-color: $primary;

    &::after {
      content: "";
      position: absolute;
      bottom: -0.5px;
      left: 0;
      width: 100%;
      height: 2px;
      background-image: linear-gradient(to right, #7167D5, #53A0FD);
      transform: scaleX(0);
      transform-origin: left;
      transition: all 0.2s $easing;
    }

    &.grow::after {
      transform: scaleX(1)
    }
  }

  .icon {
    position: absolute;
    bottom: 8px;
    right: 0px;

    .required-label {
      display: inline-block;
      padding: 3px 5px;
      font-size: 0.6rem;
      color: $fontColorLight;
      border: 1px solid $fontColorLight;
      border-radius: 5px;
      transform: scale(0.6);
      transform-origin: right bottom;
    }

    .custom-icon {
      display: inline-block;
    }
  }

  
}

.mt-select-meta {
  position: relative;
  overflow: auto;

  /* 
  ** Error State
  */

  &.error {
    .hint {
      color: $error;
    }

    .hint {
      animation: shake 0.53s cubic-bezier(.36,.07,.19,.97) both;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
  }

  .hint {
    padding: 5px 0px;
    font-size: 0.6rem;
    color: $fontColorLight;
  }

  .hint {
    float: left;
    width: 85%;
  }

  
}
</style>
