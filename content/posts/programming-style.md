---
title: 'Why I Use One Global Variable for My Game State'
pubDate: 2026-04-09
---

My preferred programming style has been changing a lot recently, and younger me would probably think I'm taking steps backwards! I'm starting to embrace a lot of coding habits which I previously thought were bad: very imperative code, code that repeats itself, and using global variables.

I've dabbled in game dev, mostly game jams, for a while now. After trying many different engines and frameworks, I realized I'm usually more productive using smaller game frameworks than larger engines (and I find them more fun!). Game engines enforce a lot of opinions about how to structure your game, and I find they often make simple things much harder than they need to be. Noel Berry, co-creator of [Celeste](https://www.celestegame.com/), wrote a lot about this that I resonate with in [Making Video Games in 2025 (without an engine)](https://www.noelberry.ca/posts/making_games_in_2025/)!

So, where do global variables come in? Games typically run some update logic and rerender the game at some interval. That means you'll probably have lots of state that needs to be updated and maintained between updates. Different programming paradigms suggest different solutions for this structure, but I find the simplest solution tends to work the best: just have one big global state variable which contains all the necessary state for your game!

Why? Having all of your game state in one plain object (JavaScript) or struct (C/C++) makes serializing and deserializing game state trivial, makes hot reloading trivial, and makes save states trivial. It opens the door for useful testing strategies like comparing snapshots of game state to expected results. Lastly, the lack of complexity feels like a feature itself. No more spending time on how to best modularize and encapsulate state! 

How did I get here? I was initially very reluctant to program this way. So much programming education recommends avoiding global variables completely. It was only after seeing how often programmers in the [Handmade Community](https://handmade.network/) recommended this approach that I gave it a try. In an [interview with Billy Basso](https://www.youtube.com/watch?v=YngwUu4bXR4) about programming [Animal Well](https://store.steampowered.com/app/813230/ANIMAL_WELL/), he mentions storing all his game state in one big global state struct and says it worked out great! I found this fascinating because Animal Well is a massive game with a gigantic world and a ton of features. I really didn't think a single global state struct could scale for a game like that.

This pattern has been great for games and other highly interactive projects. A lot of the things I was scared about (like tricky bugs creeping up from state mutations) turn out to not really be a problem. There is good wisdom behind generally avoiding global variables, but it is even more useful to understand what the actual problems with global variables are and when they don't apply!

Your state struct/object can represent a hierarchy: game state includes level state, which includes entities, which includes player state. You can pass these smaller subtrees of state throughout your codebase, totally avoiding deep, scary mutation bugs!

If your language has modules or namespaces, then it is easy to track its usage across the codebase. It is trivial to limit direct usage and start passing subtrees early and often!

```ts
// state.ts

export let state = {
  editor: {
    // ...
  },
  level: {
    // ...
  },
  overworld: {
    // ...
  }
}

// game.ts

import state from "./state"

function tick(state) {
  updateEditor(state.editor)
  updateLevel(state.level)
  updateOverworld(state.overworld)
  
  drawEditor(state.editor)
  drawLevel(state.level)
  drawOverworld(state.overworld)
}
```

If your language doesn't have features like this (C for example), you can name your variable `_state` or `dangerousStateGlobal`. Then direct usage is easier to search for, and it's easier to be mindful of it as well!

```c
GameState _state = {
  // ...
};

void tick() {
  updateEditor(_state.editor)
  updateLevel(_state.level)
  updateOverworld(_state.overworld)
  
  drawEditor(_state.editor)
  drawLevel(_state.level)
  drawOverworld(_state.overworld)
}
```
