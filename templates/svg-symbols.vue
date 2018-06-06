<template>
<div
  :class="['svg-icon', iconName]"
  :style="{'--svg-icon-scale': safeScale}"
>
  <%= icons.map(function(icon){
    const symbolAttrs = attributesToString({
      class: icon.id,
      viewBox: icon.svg.viewBox,
      preserveAspectRatio: icon.svg.originalAttributes.preserveAspectRatio,
    })
    return `<svg${ symbolAttrs } v-if="name === '${icon.id}'">${ icon.svg.content }</svg>`
  }).join('\n') %>
</div>
</template>

<style>
:root {
  --svg-icon-scale: 1;
}
</style>
<style scoped>
<% _.forEach( icons, function( icon ){ %><%= icon.class %> {
  width: calc(<%= icon.width %> * var(--svg-icon-scale));
  height: calc(<%= icon.height %> * var(--svg-icon-scale));
}<% if (icon.style) { %>
<%= icon.style %><% } %>
<% }); %>
</style>

<script>
export default {
  name: `svg-symbol`,
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
