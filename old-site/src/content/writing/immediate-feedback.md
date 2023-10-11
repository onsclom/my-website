---
layout: ../../layouts/BlogLayout.astro
title: "Make Programming Fun and Get Better in the Process"
pubDate: 2023-07-16
---

Gaming is naturally fun. It feels effortless and exciting. Programming is naturally tedious and hard. Why is this? Games give **immediate feedback**. Game developers add [game juice](https://garden.bradwoods.io/notes/design/juice) to maximize feedback per input. If you aren’t careful, programming becomes the opposite. I’ll start with an example of a bad feedback loop.

My first programming course in university taught us C++. For coding assigments we were instructed to: `ssh` into university server, `nano main.cpp`, edit our code (without any syntax highlighting or linting), save, exit nano, `g++ main.cpp`, then `./a.out`. Needless to say, we all **hated** doing our assignments. Was it good to learn basic unix commands? Sure. Could there have been a better process? Absolutely.

Because we did everything through `ssh`, all our actions had latency. Simply typing felt terrible. nano made things worse. Everything we knew about GUI text editors went out the window, so we were 10x slower at editing text. The laborious process of making changes to code, compiling, and running totally ruined the feedback loop. I believe we could have learned faster and more importantly, enjoyed programming, if we used a process that promoted immediate feedback.

19 year old me would be very suprised to hear that I actually enjoy programming now. I do things like [Advent of Code](https://adventofcode.com/), coding puzzles much like my school assignments, for fun! Also, I make projects not just for the final product, but because I enjoy the process! I believe immediate feedback is the main factor that caused this change. The following are different ways I foster immediate feedback in programming *(in no particular order)*.

### Watch files

Finding yourself making changes and rerunning code often? Setup a watcher to rerun your code on changes. [Deno](https://deno.land/) makes this easy with `deno run —-watch`. With Rust code I like to use [cargo-watch](https://github.com/watchexec/cargo-watch). Saving a file and immediately seeing the output of your program is really nice.

### Tests

For the small cost of writing tests, you get a lot of benefits. Combine a filewatcher with tests for a great experience. You will see which tests fails, the expected output, and the actual output. Once you solve a problem, you are immediately rewarded with pretty green text.

### Live code reloading

The most common example of this is using `npm run dev` with React. A filewatcher listens for changes to files and updates the pages in the dev server. Great code reloading remember your state in between changes. It's really nice to skip recreating state with manual user input every change.

### Minimize boilerplate

If you need to make a new class and `public static void main` for simple things, that creates a really poor feedback loop (sorry Java). But languages aren’t the only cause of boilerplate. Look at your libraries and frameworks too. How much boilerplate does it take to do common things with your languages, frameworks, and libraries?

### Linters

Good linters are amazing. They tell you when you make mistakes immediately in your editor. They have great error messages, and maybe even suggest alternative approaches. However, good linters take nuance. It’s possible to create linter configs which worsen the feedback cycle. 

### Static typing

Good type systems have great type inference. A type system is a tool meant to help productivity, not hinder. TypeScript is great because even if the types in your program are not valid, it doesn't stop you from running your code.

My favorite part of static typing is how it enables autocomplete right in your editor. When I type `.` on an object I expect to see the method I want in autocomplete. I'm immediately told whether that object is the type I expect. You can probably tell that I mostly work with TypeScript, but languages like Haskell and Rust have type systems that are even more powerful.

### Quokka

[Quokka](https://quokkajs.com/) is amazing if you write JavaScript or TypeScript. It is my favorite way to do Advent of Code. I can simply highlight expressions to see what they return. While programming I’m able to ensure my code does what I expect. And when I need to debug things, Quokka makes that super easy too.

### Minimize compile/build times

Rust does a lot of great stuff at compile time, but this comes at the cost of compile times. The longer compile times are, the longer feedback cycles become. Big web projects with lots of dependencies have this problem with build times. This is a difficult problem that does not always have a clear answer. In the case of Rust, compile times feel worth it because of all the benefits the compiler gives.

### Decomposition

Everything above has to do with tooling, but this is something you can do regardless of tools. Big problems create slow feedback cycles. By breaking big problems into smaller, self-contained problems, you create better feedback cycles.

## But Why

*Why* does immediate feedback make things so much better? To be honest I'm not completely sure, but I have a hypothesis: Having fun and learning is very much an unconscious process. High quality immediate feedback helps the unconscious brain thrive.

## Conclusion

This ended up being a much bigger topic than I first expected. I took many detours and restrained myself from taking many more. My list is far from exhaustive, and I am constantly trying to improve my programming workflows. If you have things to add I would love to hear about it!

The big takeaway: If you want to **enjoy programming** and become a **better programmer**, **make feedback immediate**.
