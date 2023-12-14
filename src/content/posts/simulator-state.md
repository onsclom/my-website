---
title: 'Your "Simulation" Might Not Need State'
pubDate: 2023-03-27
---

The bouncing DVD logo is a fun and easy coding project. Watching Daniel Shiffman code it in p5.js is
one of my earliest programming memories. However, the naive solution is far from optimal.

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/0j86zuqqTlQ' frameborder='0' allowfullscreen></iframe></div>

If you haven't already made this DVD bouncing logo, give a try! Really, take a break from reading
and come back. We are going to go over the naive implementation, and I don't want to spoil it.

Okay, welcome back! You probably wrote code that works very similar to Daniel's. You need to track
the logo's `x`, `y`, `dx`, and `dy`. If the logo hits a side wall you flip its `dx`, and if it hits
the ceiling or floor you flip the `dy`. This totally works! Doing this in TypeScript it might look
like:

```ts
const dvdLogo = document.getElementById('dvd-logo') as HTMLDivElement;
let x = 0;
let y = 0;
let dx = 1;
let dy = 1;

function update() {
	x += dx;
	y += dy;
	dvdLogo.style.left = x + 'px';
	dvdLogo.style.top = y + 'px';
	if (x < 0 || x + dvdLogo.clientWidth > window.innerWidth) dx *= -1;
	if (y < 0 || y + dvdLogo.clientHeight > window.innerHeight) dy *= -1;
}

(function loop() {
	update();
	requestAnimationFrame(loop);
})();
```

But there's actually a totally different way to do this. First, let's define some things.

- **Animation**: takes time as a parameter and returns an image.

- **Simulation**: takes some `state` then returns updated `state` and image.

These types can be defined in TypeScript.

```ts
type Animation = (time: number) => Image;

type Simulation = <T>(state: T) => { state: T; image: Image };
```

<small>(If you don't understand these types it's OK)</small>

Our naive DVD logo implementation would be a `Simulation`. Ok... maybe it doesn't fit the exact type
definition. We aren't doing pure functional programming. But the essence is the same. We read state
(`x`, `y`, `dx`, `dy`), compute new state, and render (update the position).

Would it be possible to describe the bouncing DVD logo as an `Animation`? Can we actually eliminate
the need for state? Think about this for a while.

If you're like me, at first, this sounds impossible. We would need to come up with some advanced
formula to account for collisions and calculate the position of our logo for any given time.

But, it's really not too complex. Let's simplify things by thinking about one dimension.

```ts
function update(time: number) {
	const xRange = window.innerWidth - dvdLogo.clientWidth;
	const x = time % (xRange * 2);
	dvdLogo.style.left = `${x <= xRange ? x : xRange * 2 - x}px`;
}
```

A little math goes a long way! Isn't that cool? You can probably guess how to calculate the `y`
position now. Here's the full solution.

```ts
const dvdLogo = document.getElementById('dvd-logo') as HTMLDivElement;

function update(time: number) {
	const xRange = window.innerWidth - dvdLogo.clientWidth;
	const yRange = window.innerHeight - dvdLogo.clientHeight;
	const x = time % (xRange * 2);
	const y = time % (yRange * 2);
	dvdLogo.style.left = `${x <= xRange ? x : xRange * 2 - x}px`;
	dvdLogo.style.top = `${y <= yRange ? y : yRange * 2 - y}px`;
}

(function loop() {
	update(Date.now() / 10);
	requestAnimationFrame(loop);
})();
```

We converted our previous `Simulation` into an `Animation`. Instead of maintaing state, we calculate
positions using just `time`. Not only did we make the code simpler, but we also made the code
function better!

How? Well, there were actually a couple of problems with our previous code:

1. The `Simulation` solution is framerate dependent. The DVD would move faster with higher
   framerates. The `Animation` solution is framerate independent.

2. The `Simulation` actually has a bug. If you resize the window to be smaller you can trap the DVD
   logo on an edge. Resizing the window in the `Animation` solution means we recalculate to the
   correct position.

In addition to all this, `Animations` have a lot of benefits over `Simulations`. They are easier to
test, easier to rewind or fast forward, and it's possible to instantly get the result for any point
in time.

But wait, we can take this DVD example further! The DVD logo changes color every time it hits a
wall. Surely we need state for that, right?

Actually, it's possible to calculate the amount of bounces that happened since `time` equalled 0.

```ts
const bounces = Math.floor(time / xRange) + Math.floor(time / yRange);
```

And we can use that to choose a color.

```ts
const colors = ['red', 'green', 'blue', 'yellow'];
dvdLogo.style.backgroundColor = colors[bounces % colors.length]!;
```

Isn't that cool?! Or maybe you think we've been getting really lucky with these examples. Maybe you
remembered something tricky. The actual DVD logo picks a color randomly. You probably think this is
where we are finally stumped.

Well, with a seeded random function this is possible too!

```ts
const random = (seed: number) => Math.sin(seed * 1000) * 0.5 + 0.5;
const randIndex = Math.floor(random(bounces) * colors.length);
dvdLogo.style.backgroundColor = colors[randIndex]!;
```

Ok, well, maybe this isn't the best random function. I'm getting a bit lazy now. But I'm sure you
get the idea.

Next time you find yourself rushing to use state, try spending some more time at the whiteboard. Not
only will it make your code simpler, but it also might make it better.

View discussion for this post at [Hacker News](https://news.ycombinator.com/item?id=35336632).
