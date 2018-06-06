<template>
<div <%= attributesToString(svgAttrs) %>>
  <%= icons.map(function(icon){
    const symbolAttrs = attributesToString({
      class: `svg-icon svg-icon--${icon.id}`,
      viewBox: icon.svg.viewBox,
      preserveAspectRatio: icon.svg.originalAttributes.preserveAspectRatio,
    })
    return `<svg${ symbolAttrs } :style="{'--svg-icon-scale': safeScale}" v-if="name === '${icon.id}'">${ icon.svg.content }</svg>`
  }).join('\n') %>
</div>
</template>

<style>
:root {
  --svg-icon-scale: 1;
}
</style>
<style scoped>
<% _.forEach( icons, function( icon ){ %>.svg-icon--<%= icon.id %> {
  width: calc(<%= icon.width %> * var(--svg-icon-scale));
  height: calc(<%= icon.height %> * var(--svg-icon-scale));
}<% if (icon.style) { %>
<%= icon.style %><% } %>
<% }); %>
</style>

<script>
export default {
  name: `svg-icon`,
  props: {
    name: {
      default: ``,
      type: String
    },
    scale: {
      default: 1,
      type: Number
    },
  },
  computed: {
    iconName() {
      return <%= 'name' %> ? <%= '`svg-icon--${name}`' %> : '';
    },
    safeScale() {
      return Number.isFinite( this.scale ) ? this.scale : 1;
    }
  }
}
</script>
