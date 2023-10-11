---
layout: ../../layouts/BlogLayout.astro
title: "Experimenting with Drawing Combinators"
pubDate: 2023-03-25
---

I'm working on a functional TypeScript library for drawing to a canvas inspired by [parser combinators](https://theorangeduck.com/page/you-could-have-invented-parser-combinators). Let's try it out by making some generative art! If you haven't heard of creative coding, [this talk](https://www.youtube.com/watch?v=4Se0_w0ISYk) by Tim Holman is a great intro.

First we need to setup a project. We will make an `index.html` with a canvas, a `main.ts` that renders our sketch to the canvas, and a `sketch.ts` that defines our sketch.

```ts
// main.ts

import { render } from "./drawing-combinators"
import sketch from "./sketch"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
render(canvas, sketch)
```

```ts
// sketch.ts

import * as D from "./drawing-combinators"

export default [
  D.fillColor("white",
    D.fillRect(0, 0, 100, 100)),
  D.strokeCircle(50, 50, 50),
]
```

The `render` function expects a 100x100 by sketch. It then scales to fit the canvas and renders the sketch.

The above code results in a circle on a white background.

![](/images/sketch1.png)

Now we can edit `sketch.ts` to draw whatever we want. Let's start with a classic, [10 PRINT](https://10print.org/).

```ts
import * as D from "./drawing-combinators"

const range = (amount: number) => [...Array(amount).keys()]

const line = (size: number) =>
  Math.random() < 0.5 ?
    D.strokeLine(0, 0, size, size) :
    D.strokeLine(0, size, size, 0)

const grid = (size: number) =>
  range(size).map((x) =>
    range(size).map((y) =>
      D.translate(x * 100 / size, y * 100 / size,
        line(100 / size))))

export default [
  D.fillColor("white",
    D.fillRect(0, 0, 100, 100)),
  grid(20)
]
```

![](/images/sketch2.png)

The code isn't as concise as it is on the Commodore 64, but this will allow for some fun additions. Let's make the lines horizontal and vertical.

```ts
const line = (size: number) =>
  Math.random() < 0.5 ?
    D.strokeLine(0, size / 2, size, size / 2) :
    D.strokeLine(size / 2, 0, size / 2, size)
```

![](/images/sketch3.png)

What if all 4 types of lines are possible?

```ts
const randomChoice = <T>(choices: T[]) =>
  choices[Math.floor(Math.random() * choices.length)]

const line = (size: number) =>
  randomChoice([
    D.strokeLine(0, 0, size, size),
    D.strokeLine(0, size, size, 0),
    D.strokeLine(0, size / 2, size, size / 2),
    D.strokeLine(size / 2, 0, size / 2, size)
  ])
```

![](/images/sketch4.png)

What if we clip it to a circle?

```ts
export default [
  D.fillColor("white",
    D.fillRect(0, 0, 100, 100)),
  D.clipCircle(50, 50, 40,
    grid(20)),
]
```

![](/images/sketch6.png)

That's pretty cool! Now let's change it up entirely and try something recursive.

```ts
import * as D from "./drawing-combinators"

const centeredSquare = (x: number, y: number, size: number) =>
  D.translate(x - size / 2, y - size / 2,
    D.strokeRect(0, 0, size, size)
  )

const DIST_MULTIPLIER = .027
const ANGLE_CHANGE_SPEED = .4
const SIZE_CHANGE_SPEED = .8

const spiral = (x: number, y: number, size: number, angle: number) =>
  size < 40 ?
    [
      D.translate(x, y,
        D.rotateAround(angle, size / 2, size / 2,
          centeredSquare(0, 0, size)
        )
      ),
      ...spiral(
        x + Math.cos(angle) * DIST_MULTIPLIER * size ** 2,
        y + Math.sin(angle) * DIST_MULTIPLIER * size ** 2,
        size + SIZE_CHANGE_SPEED,
        angle + ANGLE_CHANGE_SPEED
      )
    ] :
    []

export default [
  D.fillColor("white",
    D.fillRect(0, 0, 100, 100)),
  D.strokeWidth(
    1 / 3,
    spiral(50, 50, 1, 0)
  )
]
```

![](/images/sketch5.png)

Nice! I think this was a successful experiment. Creative coding is always fun, but this library made it more fun. Changing requirements on the fly is common when creative coding, so functional programming is a great fit. Our code becomes composable and reusable by default.
