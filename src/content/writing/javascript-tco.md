---
layout: ../../layouts/BlogLayout.astro
title: "Bun, Javascript, and TCO"
pubDate: 2023-09-09
---

[Bun](https://bun.sh/) is a JavaScript runtime that just released version 1.0! Now you have three choices for running JavaScript outside of the browser: Node, Deno, and Bun. One of Bun's selling points is speed! It makes some interesting decisions to acheive this.

For one, Bun is programmed using [Zig](https://ziglang.org/). This results in an exciting universe: Node is made with **C++**, Deno is made with **Rust**, and Bun is made with **Zig**. Isn't this an exciting battle of system langages?! We will actually focus on something else however.

Node and Deno are built on V8, while Bun is built on JavaScriptCore. You might know V8 as the JavaScript engine of Chrome. JavaScriptCore is the engine for Safari. They have lots of interesting differences, but we will be focusing on a niche optimization which JavaScriptCore implements and V8 does not: **Tail Call Optimzation**.

Let's dive in by writing some real code! Imagine you need to implement the following function:

```ts
/*
  Returns an array of numbers counting from 1 to amount.

  Examples:
    count(3) => [1, 2, 3]
    count(5) => [1, 2, 3, 4, 5]
    count(-1) => []
*/
function count(amount: number): number[]
```

Give it a try yourself if you want! I imagine most people will come up with a solution like:

```ts
function count(amount: number): number[] {
  let nums: number[] = []
  for (let i = 1; i <= amount; i++) nums.push(i)
  return nums
}
```

This is a great solution that works totally fine! But now, I will present an arbitrary challenge so to introduce tail call optimization. Can you represent this as recursive function? Give it a try, or don't... I'm not your mom. After a bit of thinking, you might come up with this:

```ts
const count = (amount: number) =>
  amount > 0 ? [...count(amount - 1), amount] : []
```

Look at that succinct solution! It might look familiar to recurrence relations from math class. You might be thinking, "It looks like loops can be expressed more elegantly with recursion!" But, now I have something sad to share. Try doing `count(100000)` (Deno and Bun allow running TypeScript directly). You will get an error like `Maximum call stack size exceeded`.

Recursion takes up precious memory on the call stack! There may be commands to increase the call stack size for your program, but there is only so much the OS will allow per program. Memory on the heap is much less restricted. How can we use recursion without fear of exceeding the call stack? The answer: hope your JavaScript engine implements TCO and write your recursion in a way that can be optimized!

The process of rewriting a function to be tail call optmized generally involves moving state to arguments. The recursive call needs to be the last thing in the function's AST. The TCO version of our recursive function looks like:

```ts
const count = (amount: number, cur: number[] = []) =>
  cur.length >= amount ? cur : count(amount, [...cur, cur.length + 1])
```

Slightly less succint and elegant, but it can be tail call optimized now! If we run `count(100000)` with Deno, we still get `error: Uncaught RangeError: Maximum call stack size exceeded`. With Bun, the program now successfully runs! But there's still one more problem... This solution is really slow.

`count(100000)` with this TCO solution takes 7 seconds with bun. The original for loop solution takes `.01s`. How can we get similar performance to the for loop solution while still using recursion? We use mutation:

```ts
function count(amount: number, cur: number[] = []) {
  if (cur.length >= amount) return cur
  cur.push(cur.length + 1)
  return count(amount, cur)
}
```

This function is starting to look a lot like the orignal for loop solution. It's not very succinct or elegant anymore. But, it runs `count(100000)` at `.01s` as well. Nice!

The minimalist part of me really enjoys TCO. It enables a language to express complex and efficient programs without imperative loops. In the case of JavaScript, it means a smaller subset of the language can express all programs. Most beginners are taught loop statements as if they are fundamental or required in every language. But that's not true. With TCO, you can express any loop statement using recursion and get similar performance.

Languages that rely on recursion like LISPs often specify that TCO must be implemented in their language spec. Sadly, TCO is only for JavaScript in JavaScriptCore. Thankfully, Bun and Safari use JavaScriptCore!
