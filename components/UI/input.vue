<template>
  <div>
    <div class="mt-input" :class="hasError ? 'error' : ''">
      <div class="label text-regular" ref="label">{{ label }}</div>
      <input class="text-regular text--black" v-if="!customInputSlote"
        @focus="focus" 
        @blur="blur" 
        v-model="content" 
        :type="type"/>

      <div class="custom-input-slot" v-else>
        <slot name="custom-input"></slot>
      </div>

      <div class="icon">
        <span class="required-label text-x-small" v-if="showRequiredIcon">{{ requiredMsg }}</span>
        <checkIcon :width="15" :height="15" v-else-if="showCheckIcon"></checkIcon>
        <div class="custom-icon" v-else-if="showCustomIcon" @click="clickCustomIcon">
          <slot></slot>
        </div>
      </div>
      <div class="underline" ref="underline"></div>
    </div>
    <div class="mt-input-meta" :class="hasError && !persistentHint ? 'error' : ''">
      <div class="hint text-caption" v-if="hasError || hint">
        {{ hasError && !persistentHint ? errorMsg : hint }}
      </div>
      <div class="counter text-caption" v-if="showCounter">{{ content.length + '/' + counterLimit }}</div>
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

    // Input type
    type: {
      type: String,
      require: false,
      default: 'text'
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

    // Content character limit
    // this will toggle on the content counter, and show error if content length exceeds counter limit
    counterLimit: {
      stype: [String, Number],
      require: false
    },

    // Array of rules to test against, show error if any failure
    rules: {
      type: Array,
      require: false
    },

    // Error message if rules test fail
    // Must specify if rules prop is used
    rulesErrorMessage: {
      type: String,
      require: false
    },

    // Validate content on blur
    // Only validate content against rules
    // NOT affect the counter error (if enabled)
    validationOnBlur: {
      type: Boolean,
      require: false
    },

    // Toggle validation check icon
    validationCheckIcon: {
      type: Boolean,
      require: false
    },

    // Use custom icon/controller
    // If this feature is enabled, the check icon will be disabled
    // ex: custom clear input btn
    useCustomIcon: {
      type: Boolean,
      require: false
    },

    // If the Custom Icon is persistent
    // Note: Used with useCustomIcon prop
    // ex: used in date selecotr or time selector
    persistentCustomIcon: {
      type: Boolean,
      require: false,
    },

    // If custom slot component is used
    // ex: date selector or time selector
    customInputSlote: {
      type: Boolean,
      require: false,
      default: false
    }
  },

  data () {
    return {
      // Input Content
      content: '',

      // used to check if required error
      // @ hasRequiredError (computed prop)
      requiredError: false,

      // Control when validation starts
      // validation as typing or validation on blur
      validating: false,

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
      // check if resetErrors is on > check required error > check rule error > check counter error
      return this.hasCounterError || this.hasRuleError || this.hasRequiredError
    },

    errorMsg () {
      // require error > rule error > counter error
      if (this.hasRequiredError) {
        return this.requiredMsg
      } else if (this.hasRuleError && this.rulesErrorMessage) {
        return this.rulesErrorMessage
      } else if (this.hasCounterError) {
        return this.counterErrorMessage
      }  
    },

    /* 
    ** Reuiqred Input
    */

    // Required Message
    // what to show in the indicator box
    // @ template
    requiredMsg () {
      if (this.required) return '必填'
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
    ** Character Counter
    */

    // Toggle character counter
    // @ template v-if
    showCounter () {
      return !!this.counterLimit
    },

    // check if counter error exists ONLY when showCounter prop is true
    // @ hasError (computed prop)
    hasCounterError () {
      return this.showCounter && this.content.length > this.counterLimit
    },
    counterErrorMessage () {
      return '内容过长'
    },

    /* 
    ** Rules
    */

    // check if rule error
    // test input content against the rules
    // @ hasError (computed prop)
    hasRuleError () {
      if (this.rules && this.validating) {
        let resultArr = []

        this.rules.forEach(rule => {
          let result = rule(this.content)

          // result can be either true (no error) or false (has error)
          resultArr.push(!result)
        })

        return resultArr.some(result => result)
      }
    },



    /* 
    ** Icon Control
    */
    showRequiredIcon () {
      return this.required && !this.content
    },
    showCheckIcon () {
      return !this.useCustomIcon && this.validationCheckIcon && this.validated
    },
    showCustomIcon () {
      return this.useCustomIcon && this.persistentCustomIcon || this.useCustomIcon && !!this.content
    }

  },

  watch: {
    content (newVal, oldVal) {
      // remove required error when typed
      if(newVal) {
        // reset property
        this.validating = false
        this.hasRequiredError = false

        // if not validation on blur not set, start validating as typing
        if(!this.validationOnBlur) this.validating = true
      }
    }
  },

  methods: {
    focus () {
      if (!this.content) {
        this.$refs.label.classList.add('moving')
      }
      this.$refs.underline.classList.add('grow')

      // reset validated
      this.validated = false
    },

    blur () {
      this.validating = true

      // set required error if clicked, but not typed
      if (!this.content) {
        this.hasRequiredError = true
        this.$refs.label.classList.remove('moving')
      }

      if (!this.hasError) {
        this.validated = true
        this.validating = false

        // report to parenet component
        this.$emit('blured', this.validated)
      }

      this.$refs.underline.classList.remove('grow')
    },

    // clear the error styles
    resetError () {
      this.requiredError = false
      this.validating = false
      this.validated = false
    },

    // clear input content and clear error styles
    resetInput () {
      this.content = ''
      this.resetError()
    },

    // emit $vm when custom icon is clicked
    // ONLY valid if useCustomIcon is on
    clickCustomIcon () {
      if (this.useCustomIcon) {
        this.$emit('customIconClicked', this)
      }
    }
  }
}
</script>


<style lang="scss">
@import '~assets/style/_color';
$easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);

.mt-input {
  position: relative;
  width: 100%;
  height: 55px;
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

  input {
    display: block;
    outline: none;
    border: none;
    width: 100%;
    height: 35px;
  }

  .custom-input-slot {
    width: 100%;
    height: 35px;
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
      color: $fontColorLight;
      border: 1px solid $fontColorLight;
      border-radius: 5px;
      transform: scale(0.6);
      transform-origin: right bottom;
    }

    .custom-icon {
      display: inline-block;
      // transform: translateX(-50%);

      &:hover {
        cursor: pointer;
      }
    }
  }

  
}

.mt-input-meta {
  position: relative;
  overflow: auto;

  /* 
  ** Error State
  */

  &.error {
    .hint, .counter {
      color: $error;
    }

    .hint {
      animation: shake 0.53s cubic-bezier(.36,.07,.19,.97) both;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
  }

  .hint, .counter {
    padding: 5px 0px;
    color: $fontColorLight;
  }

  .hint {
    float: left;
    width: 85%;
  }

  .counter {
    float: right;
    width: 15%;
    text-align: right;
  }

  
}
</style>

