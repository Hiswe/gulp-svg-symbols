<template>
  <main role="main">
    <h1>Vue SVG symbols</h1>
    <h2>Fill & scale test</h2>
    <ul class="layout-fill-scale">
      <li><svg-symbol class="red-github" name="github" :scale="3"></svg-symbol></li>
      <li><svg-symbol class="resized-with-css" name="aspect-ratio"></svg-symbol></li>
    </ul>
    <h2>All icons</h2>
    <ul class="layout-all-icons">
      <li><svg-symbol name="chinese-letter-with-styles"></svg-symbol></li>
      <li><svg-symbol name="gradient"></svg-symbol></li>
      <li><svg-symbol name="xlink-href"></svg-symbol></li>
      <li><svg-symbol name="aspect-ratio"></svg-symbol></li>
      <li><svg-symbol name="crane-noir"></svg-symbol></li>
      <li><svg-symbol name="github"></svg-symbol></li>
    </ul>
  </main>
</template>

<style>
.red-github {
  fill: red;
}
.resized-with-css {
  width: 100%;
}
/* layout styles */
html,
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 20px;
  padding: 0;
  margin: 0;
}
html {
  min-height: 100vh;
  background-color: #faaca8;
  background-image: linear-gradient(19deg, #faaca8 0%, #ddd6f3 100%);
  color: #333;
  padding: 1.5rem;
}
h1 {
  font-weight: 100;
  text-align: center;
  font-size: 3rem;
  margin: 0 0 2rem;
}
h2 {
  text-align: center;
}
ul,
li {
  list-style: none;
  padding: 0;
}
ul {
  display: grid;
  grid-gap: 1rem;
}
li {
  background-color: #fafafa;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="rgb(238,238,238)" width="100" height="100"><rect x="0" y="0" width="50" height="50"></rect><rect x="50" y="50" width="50" height="50"></rect></svg>');
  background-size: 24px 24px;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.layout-fill-scale {
  grid-template-columns: 120px 1fr;
}
.layout-all-icons {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
</style>

<script>
export default {
  name: `layout`,
}
</script>

