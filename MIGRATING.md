### from v3.0+ to v3.2

- if you were using the sass template, rename `default-sass` to `default-scss` in your gulpfile

### from v2.0+ to v3.0

- Configuration deprecated options (still working but will issue a warning):
  - `option.className` has been replaced by `options.class`.
  - `option.svgClassname` has been replaced by `options.svgAttrs.class`
- Datas in custom templates has been modified. This can break some templates.
  - `icon.className` is replaced by `icon.class` in the icons list
  - `svgClassname` is replaced by `svgAttrs.class`

### from v1.0+ to v2.0

- Style attribute from the default SVG template has been removed.  
  You will have to take care of it manually if you intend to inline the SVG symbols in your DOM. (see `svgClassname` option in the README)

### from v0.2+ to v1.0

- SVGO is no more used.
- `css: false` is removed.
- svgSymbols.demoPage() method has been removed. See **Basics > demo page**

### from v0.1 to 0.2+

- `svgId` is replaced by `id`.
- `accessibility` is replaced by `title`.
- `css: false` is still working but is deprecated.
