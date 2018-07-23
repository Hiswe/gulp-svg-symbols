<style>
:root {
  --svg-icon-scale: 1;
}
</style>

<script>
const SVG_LIB = {
  <% _.forEach( icons, ( icon ) => {
    const hasStyle = icon.svg.style != null
    const hasDef = icon.svg.defs != null
    const needDef = hasDef || hasStyle
    const style = !hasStyle ? `` : `<style>${icon.svg.style}</style>`
    const defs = !needDef ? `` : `<defs>${hasDef ? icon.svg.defs : `` }${style}</defs>`
    const content = `${defs }${icon.svg.content}`
  %>
  "<%= icon.id %>": {
    id: `<%= icon.id %>`,
    class: [
      `<%= svgAttrs.class %>`,
      `<%= icon.class.replace(/^\./, '') %>`,
    ],
    width: `<%= icon.width %>`,
    height: `<%= icon.height %>`,
    style: {
      width: `calc(<%= icon.width %> * var(--svg-icon-scale))`,
      height: `calc(<%= icon.height %> * var(--svg-icon-scale))`,
    },
    'viewBox': `<%= icon.svg.viewBox %>`,
    content: `<%= content %>`,
  },<% }); %>
}
const SVG_ATTRS = <%= JSON.stringify(_.omit(svgAttrs, `class`), null, 2)  %>

export default {
  name: `svg-icon`,
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    style() {
      if (!SVG_LIB[this.name]) return {}
      return SVG_LIB[this.name].style
    },
    attrs() {
      if (!SVG_LIB[this.name]) return {}
      return {
        viewBox: this.icon.viewBox,
        width: this.icon.width,
        height: this.icon.height,
        ...SVG_ATTRS,
      }
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
        class: this.icon.class,
        style: this.style,
        attrs: this.attrs,
        domProps: {
          innerHTML: this.icon.content
        },
      }
    )
  },
}
</script>
