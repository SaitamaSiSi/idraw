# @idraw/renderer

[![Node.js CI](https://github.com/SaitamaSiSi/idraw/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/SaitamaSiSi/idraw/actions/workflows/node.js.yml)


## Usage

### Quick Start

```sh
npm i idraw_zyh_renderer
```

```js
import Renderer from 'idraw_zyh_renderer';

const renderer = new Renderer({
  width: 600,
  height: 400,
  contextWidth: 600,
  contextHeight: 400,
  devicePixelRatio: 1,
});

const canvas = document.querySelector('canvas');
renderer.render(canvas, {
  elements: [
    {
      name: "rect-001",
      x: 10,
      y: 10,
      w: 200,
      h: 100,
      type: "rect",
      desc: {
        bgColor: "#f0f0f0",
        borderRadius: 20,
        borderWidth: 10,
        borderColor: "#bd0b64",
      },
    },
  ]
})

```

### Events

```js
renderer.on('load', (e) => {
  // ...
})
renderer.on('loadComplete', (e) => {
  // ...
})

renderer.on('drawFrame', (e) => {
  // ...
})
renderer.on('drawFrameComplete', (e) => {
  // ...
})
```
