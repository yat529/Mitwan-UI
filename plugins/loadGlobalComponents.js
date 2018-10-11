/* 
** Register Global Components
** Component naming pattern: mt-[name], ex: <mt-input>, <mt-textarea>
*/

import Vue from 'vue'

// retrive components
let UIComponents = require.context('../components/UI', false, /\.(vue|js)$/)

UIComponents.keys().forEach(componentName => {
  // get component configuration
  const componentConfig = UIComponents(componentName)

  // componentName from for ex: './input.vue' to 'mt-input'
  componentName = 'mt-' + componentName.replace(/^\.\/(.*)\.\w+$/, '$1')

  // register component
  Vue.component(componentName, componentConfig.default || componentConfig)
})


let PageComponents = require.context('../components/Page', false, /\.(vue|js)$/)

PageComponents.keys().forEach(componentName => {
  // get component configuration
  const componentConfig = PageComponents(componentName)

  // componentName from for ex: './input.vue' to 'mt-input'
  componentName = 'mt-' + componentName.replace(/^\.\/(.*)\.\w+$/, '$1')

  // register component
  Vue.component(componentName, componentConfig.default || componentConfig)
})

