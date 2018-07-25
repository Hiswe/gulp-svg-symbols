<script>
const SVG_LIB = { <%
  _.forEach( icons, ( icon ) => {
    const hasStyle = icon.svg.style != null
    const hasDef = icon.svg.defs != null
    const needDef = hasDef || hasStyle
    const style = !hasStyle ? `` : `<style>${icon.svg.style}</style>`
    const defs = !needDef ? `` : `<defs>${hasDef ? icon.svg.defs : `` }${style}</defs>`
    const content = `${defs }${icon.svg.content}`
    const width = /(\d+)(\w+)/.exec(icon.width)
    const height = /(\d+)(\w+)/.exec(icon.height)
    const preserveAspectRatio = icon.svg.originalAttributes.preserveAspectRatio || ``
    const sizes = {
      width: {
        size: parseFloat(width[1], 10),
        unit: width[2],
      },
      height: {
        size: parseFloat(height[1], 10),
        unit: height[2],
      },
    }
  %>
  "<%= icon.id %>": {
    id: `<%= icon.id %>`,
    class: [
      `<%= svgAttrs.class %>`,
      `<%= icon.class.replace(/^\./, '') %>`,
    ],
    preserveAspectRatio: `<%= preserveAspectRatio %>`,
    width: {size: <%= sizes.width.size %>, unit: `<%= sizes.width.unit %>`},
    height: {size: <%= sizes.height.size %>, unit: `<%= sizes.height.unit %>`},
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
    scale: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    attrs() {
      if (!SVG_LIB[this.name]) return {} <%
      // don't use string interpolation. It somehow break lodash template compilation %>
      const width = this.icon.width.size * this.scale + this.icon.width.unit
      const height = this.icon.height.size * this.scale + this.icon.height.unit <%
      // don't use spread operator for easier babel configuration %>
      return Object.assign({
        viewBox: this.icon.viewBox,
        preserveAspectRatio: this.icon.preserveAspectRatio ? this.icon.preserveAspectRatio : false,
        width,
        height,
      }, SVG_ATTRS)
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
        attrs: this.attrs,
        domProps: {
          innerHTML: this.icon.content
        },
      }
    )
  },
}
</script>
