# gulp-svg-symbols build-in templates

Here are all the templates provided by the plugin  and the result you can expect from them:

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [default-svg](#default-svg)
- [default-css](#default-css)
- [default-demo](#default-demo)
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

## default-sass

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
