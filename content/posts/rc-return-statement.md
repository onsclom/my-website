---
title: 'Recurse Center Return Statement'
pubDate: 2026-05-08
---

Today marks the last day of my six-week half batch at [The Recurse Center](https://www.recurse.com), a self-directed programming retreat! This is my return statement, a tradition where Recursers reflect on their batch. Here is a non-exhaustive list of things I worked on!

The weekend prior to my batch, I worked on [Burger Boy](https://burger-boy.onsclom.net/) with my friend Sebastian for a 48-hour game jam. The first thing I did at RC was make a [visual level editor](https://burger-boy.onsclom.net/#editor) so my non-technical friends could create and share levels.

Throughout RC, I did lots of iterating on [onsclom.net](https://onsclom.net), the site you are on now! The homepage features an artsy, interactive \<canvas\> background which took many cycles of iteration to get the current behavior with great performance on low-end devices. For the blog portion of my site, I switched from using Astro to a more handmade solution with no dependencies aside from [Bun](https://bun.sh). 

I started diving into WebAssembly! I made [maze.onsclom.net](https://maze.onsclom.net) to benchmark JS vs WASM (generated from C using clang directly) on the same maze generation algorithm. I then made [game-of-life-wasm.onsclom.net](https://game-of-life-wasm.onsclom.net) where I called JavaScript functions from C to implement [game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

I built a parser for (a small subset of) C using C. I compiled that parser into WASM and visualized the ASTs it generates in the browser with custom, interactive force-directed graphs. Check it out @ [ast.onsclom.net](https://ast.onsclom.net)!

After a long break from writing, I wrote [Why I Use One Global Variable for My Game State](https://www.onsclom.net/posts/global-variable-state).

I made [a text editor "from scratch" using C and SDL3](https://github.com/onsclom/c-text-editor). It is software rendered using existing open-source pixel fonts. Iterated to add syntax highlighting (using my C tokenizer code), basic vim controls, and an animated cursor!

I participated in Ludum Dare 59, a 48-hour game jam, and submitted [The Transmitter](https://ldjam.com/events/ludum-dare/59/the-transmitter). This is the 8th game jam I've participated in, and I'm proud to say this game has the most polish and features of any previous jam game I've made!

To learn the math behind 3D rendering, I made a [simple software rendering demo](https://lowrez-3d.vercel.app/) using TypeScript where you can move around with a first-person perspective.

I built demos to measure input latency across different software and device pairings, measured with a high framerate camera, then shared the findings in [Input Latency Measurements](https://www.onsclom.net/posts/measuring-input-latency).

On my [Playdate](https://play.date/dev/), I recreated the [OP-1 Tombola Sequencer](https://www.youtube.com/watch?v=SHoDUCAd4-I) using the C Playdate SDK, with the crank controlling rotations and the accelerometer setting gravity direction. [Here's the code](https://github.com/onsclom/pd-tombola).

Lots of pair programming with other awesome Recursers on small-ish, from-scratch projects:
- [HTML + JS Mastermind](https://github.com/onsclom/mastermind)
- [Stacker arcade game](https://2d-stacker.vercel.app/)
- [Custom search engine](https://search-engine.recurse.com/) to more quickly access Recurse resources
- [Space Invaders in C with Raylib](https://github.com/onsclom/raylib-space-invaders)
- [Web Tombola Sequencer](https://tombola.onsclom.net/)

I am very happy with both the quantity and quality of work I accomplished during my batch! RC was everything I hoped for and more. I got to meet and work with a ton of amazing people. It feels amazing to be connected to such an awesome community of like-minded people.

If 6 or 12 weeks of self-directed programming with other intrinsically motivated programmers sounds exciting, I highly recommend [applying to Recurse](https://www.recurse.com/apply).
