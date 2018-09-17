# A-Frame Boilerplate

A Webpack-based boilerplate for Mozilla's [A-Frame](https://aframe.io/) WebVR library.

## Requirements

- Node (see **.nvmrc**)
- Yarn (latest)

## Overview

Webpack handles building the site, and is set up to include cache-busting for JavaScript _and_ static assets. A development liveserver with automatic reloading is also included.

In addition to A-Frame, several useful A-Frame components are included as project dependencies. See the `aframe-*-component` entries in **package.json**.

To reduce potential impact on VR performance due to over-abstraction, no other JavaScript-related transpilation or frameworks have been incorporated. That said, nothing about this project prevents their inclusion.

And the way I see it, if a browser supports WebVR, it's very likely it also supports ES6 syntax natively, right?

## Project Structure

### index.html

This is intended to be the project's main HTML file. For some WebVR experiences, it may be the _only_ HTML file.

By default, this file will get processed by Webpack. JavaScript will be bundled and injected. Cache-busting will also be added to any `<img>` and `<audio>` assets defined in places like A-Frame's `<a-assets>` element.

Additional HTML files can be easily added to this project. Simply add a new `HtmlWebpackPlugin` declaration to the `plugins` section of **webpack.config.js** (see the existing one for **index.html** for short descriptions of each of the values). Additional options can also be specified - see the [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) repo for more information about this plugin.

### global.js

The majority of A-Frame and its dependencies should be defined in this file. Additional dependencies can be added to the project by running `yarn add`, and then adding a corresponding `require()` statement anywhere after A-Frame:

```js
require('aframe');
# After running `yarn add aframe-look-at-component`
require('aframe-look-at-component');
```

These will get bundled into the project on the next build.

### index.js

This file is **an example** of page-specific JavaScript. To include a specific **.js** file into its corresponding **.html** file, start by adding the JS file as an `entry` in **webpack.config.js**:

```js
entry: {
  global: './src/global.js',
  index: './src/index.js',
}
```

Then, add the key as a string to the `chunks` array of the page's corresponding `HtmlWebpackPlugin` declaration:

```js
new HtmlWebpackPlugin({
  // ...snip...
  chunks: ['global', 'index'],
}),
```

The JavaScript files will be injected at build-time into the HTML file in the same order as they are defined in the array:

```html
<head>
  <!-- ...snip... -->
  <script type="text/javascript" src="global.c920cbaf33fa30bb9a70.js"></script>
  <script type="text/javascript" src="index.c920cbaf33fa30bb9a70.js"></script>
</head>
```

### assets/

The **assets/** directory is intended to contain the various textures/music/sounds/etc... used within the project. `<img>` and `<audio>` assets defined within an HTML document will be included in a production build with cache-busting query-parameters appended to the name of the file.

For example, the following HTML:

```html
<a-assets>
  <audio src="assets/audio/lakenight.mp3" autoplay preload loop></audio>
  <img id="textureBlur" src="assets/textures/blur.jpg">
</a-assets>
```

Will be converted to the following format for production:

```html
<a-assets>
  <audio src="assets/audio/lakenight.mp3?f67bfec" autoplay preload loop></audio>
  <img id="textureBlur" src="assets/textures/blur.jpg?b4465aa">
<a-assets>
```

The asset folder structure should be preserved in the production build. This is intended to make it easier to troubleshoot potential issues when loading assets.

If any assets are loaded in using tags other than `<img>` or `<audio>`, the `attrs` option for `html-loader` in **webpack.config.js** will need to be updated accordingly. See the [Usage section of the html-loader docs](https://github.com/webpack-contrib/html-loader#usage) for more information.

The cache-busting strategy can be adjusted by manipulating `file-loader`'s `options.name` property in **webpack.config.js**. Additional information about this option and others can found in the main Webpack docs [here](https://webpack.js.org/loaders/file-loader/#name).

### components/

The **components/** folder is intended for any custom A-Frame components. If you add your own component, you can easily include it in the project by adding a `require()` statement for it within **src/global.js** or a page's specific **.js** file:

```js
require('./components/does-something');
```

## Using the boilerplate

### Development

The development liveserver can be launched with a typical `start` command:

```sh
$> yarn start
```

The liveserver will be available at http://localhost:8080/. It will automatically reload whenever it detects changes to the source files.

### Production

A production build of the site can be generated via `build`:

```sh
$> yarn run build
```

The built site files will be contained within the **dist/** folder.

## Contributing

PR's are welcome! I'm still learning A-Frame myself and know that more knowledgeable people out there might know ways to improve this project.

In the meantime, I'll continue to update this as I make progress with my own A-Frame projects.
