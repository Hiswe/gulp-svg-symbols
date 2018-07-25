# gulp-svg-symbols build-in templates

Here are all the templates provided by the plugin and the result you can expect from them:

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [default-svg](#default-svg)
- [default-css](#default-css)
- [default-demo](#default-demo)
- [default-vue](#default-vue)
  - [usage](#usage)
  - [props](#props)
- [default-css-var](#default-css-var)
- [default-sass](#default-sass)
- [default-stylus](#default-stylus)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## default-svg

> responsible of generating the bundled SVG file

file name:

```
svg-symbols.svg
```

```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="github" viewBox="0 0 22 24">
    <!-- SVG content -->
  </symbol>
</svg>
```

## default-css

> responsible of generating the CSS file containing the symbols sizes and the CSS rules coming from your SVG files

file name:

```
svg-symbols.css
```

```css
.github {
  width: 22px;
  height: 24px;
}
```

## default-demo

> the demo page with the snippets you can copy & paste in your HTML

file name:

```
svg-symbols-demo-page.html
```

A single HTML file with all the right styles and a nice presentations 😀

## default-vue

> generate a vue component

file name:

```
svg-symbols.vue
```

### usage

gulpfile configuration

```js
var gulp = require('gulp')
var svgSymbols = require('gulp-svg-symbols')

function sprites() {
  return gulp
    .src(`svg/*.svg`)
    .pipe(
      svgSymbols({
        // optional: define a global class for every SVG
        svgAttrs: { class: `svg-symbol` },
        // optional: customize another class for each SVG
        class: `.svg-symbol--%f`,
        // choose the vue template
        templates: [`default-vue`],
      })
    )
    .pipe(gulp.dest(`components`))
}
exports.sprites = sprites
```

Register the component in your Vue application (or Vue component)

```js
import Vue from 'vue'
import SvgSymbol from '.svg-symbols'
Vue.component(`svg-symbol`, SvgSymbol)
```

Use it in your own components

```html
<template>
  <div>
    <svg-symbol class="github-icon" name="github" :scale="3"></svg-symbol>
  </div>
</template>

<style>
.github-icon {
  fill: red;
}
</style>
```

### props

| Name  |          | Default | Type   |                                                                |
| ----- | -------- | ------- | ------ | -------------------------------------------------------------- |
| name  | Required | none    | String | icon name                                                      |
| scale |          | 1       | Number | Scale icon size by recomputing SVG's width & height attributes |

## default-css-var

> generate a CSS file containing the symbols sizes as custom properties and the CSS rules coming from your SVG files

file name:

```
svg-symbols-custom-properties.css
```

```css
:root {
  --icon-github-width: 22px;
  --icon-github-height: 24px;
}
.github {
  width: var(--icon-github-width);
  height: var(--icon-github-height);
}
```

## default-scss

> generate a SCSS file containing the symbols sizes as variables and the CSS rules coming from your SVG files

file name:

```
svg-symbols.scss
```

```scss
$icon-github-width: 22px;
$icon-github-height: 24px;

.github {
  width: $icon-github-width;
  height: $icon-github-height;
}
```

## default-stylus

> generate a stylus file containing the symbols sizes as variables and the CSS rules coming from your SVG files

file name:

```
svg-symbols.styl
```

```styl
$icon-github-width = 22px;
$icon-github-height = 24px;

.github {
  width: $icon-github-width;
  height: $icon-github-height;
}
```
