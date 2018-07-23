import Vue from 'vue'

import Layout from './layout'
import SvgSymbol from '../ex-vue/svg-symbols'

Vue.component(`svg-symbol`, SvgSymbol)

new Vue({
  el: `#vue-root`,
  render: h => h(Layout),
})
