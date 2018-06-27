<style>
:root {
  --svg-icon-scale: 1;
}
</style>

<script>
const SVG_LIB = {
  <% _.forEach( icons, ( icon ) => { %>
  "<%= icon.id %>": {
    id: `<%= icon.id %>`,
    style: {
      width: `calc(<%= icon.width %> * var(--svg-icon-scale))`,
      height: `calc(<%= icon.height %> * var(--svg-icon-scale))`,
    },
    content: `<%= icon.svg.content %>`,
  },<% }); %>
}

export default {
  name: `svg-icon`,
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconName() {
      <%= 'return `svg-icon--${this.name}`' %>
    },
    style() {
      if (!SVG_LIB[this.name]) return {}
      return SVG_LIB[this.name].style
    },
    content() {
      if (!SVG_LIB[this.name]) return ``
      return SVG_LIB[this.name].content
    },
    icon() {
      if (!SVG_LIB[this.name]) return {}
      return SVG_LIB[this.name]
    }
  },
  render(createElement) {
    if (!SVG_LIB[this.name]) return null
    return createElement(
      `svg`,
      {
        class: this.icon.id,
        style: this.style,
        domProps: {
          innerHTML: this.content
        },
      }
    )
  },
}
</script>
