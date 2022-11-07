# WebGL Demo

## Installation

**npm:**

```sh
npm install
```

**yarn:**

```sh
yarn install
```


## Run

**npm:**

```sh
npm start
```

**yarn:**

```sh
yarn start
```

Project link after run command executed [http://localhost:3000](http://localhost:3000)

## Description

- At the center of page you could observe rotating cube
- Cube have Top, Bottom, Left, Right, Front, Back faces
- Cube faces have checkerboard pattern, implemented inside fragment shader, whithout any textures for that
- Cube have transparent areas, for implementing that have been used blending and cube faces sorting(first to render are closest to camera)
- At the left Top window corner you could observe FPS
- At the right Top window corner you could change checkerboard grid size either increase or decrease
- At the right Top window corner you could change rotating speed of cube either increase or decrease 
- When you move mouse over the cube faces, mouse pointer change and appropriate face will be highlighted(for implementing that been used framebuffer rendering and object picking by uniq color)
- All scene resizeable and include to account pixel ratio of display
