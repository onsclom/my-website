---
layout: ../../layouts/BlogLayout.astro
title: "Functional Programming - How and Why"
pubDate: 2023-01-02
---

Let's start with an example. In [Advent of Code 2022 day 1](https://adventofcode.com/2022/day/1) we get groups of numbers as input like:

```
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
```

We want a program that sums up each group and returns the largest. The largest in this example is the 4th group, 24000. 

Here is an imperative solution:

```js
const input = $("pre").innerText
let runningMax = 0
for (let group of input.split("\n\n")) {
    let runningSum = 0
    for (let num of group.split("\n"))
	    runningSum += Number(num)
    runningMax = Math.max(runningMax, runningSum)
}
console.log(runningMax)
```

Here is a functional solution:

```js
const input = $("pre").innerText
function sumGroup(group) {
	return group
		.split("\n")
		.map(Number)
		.reduce((a,b)=>a+b)
}
const sortedGroups = input
	.split("\n\n")
	.map(sumGroup)
	.sort((a,b)=>a-b)
console.log(sortedGroups.at(-1))
```

The imperative solution:
* We declare variables called `runningMax` and `runningSum` that we mutate throughout the program
* We use `for` loops to iterate

The functional solution:
* We avoid declaring mutable variables
* Instead of iterating with `for` loops, we use *higher order functions* like `map`, `reduce`, and `sort`

*Higher order functions* are functions that operate on other functions. `map`, `reduce`, and `sort` take a function as an argument.

How exactly does one do functional programming?

| Avoid | Favor |
| ------ | --- |
| mutable state | function parameters and immutable data |
| iterative steps | transforming data |
| loop statements | recursion or higher order functions |
| intertwined data and behavior | separated data and behavior |

Often times functional programming looks like using higher level functions. You might be wondering, "Functions like `map` are basically fancy loops! What if `map` did not already exist?" A functional programmer would write map themself using recursion. Anything written with loop statements can be rewritten with recursion.

Imagine we want a `range` function where `range(5)` returns `[1,2,3,4,5]`.

Imperative solution:

```js
function range(end) {
	let nums = []
	for (let i=1; i<=end; i++)
		nums.push(i)
	return nums
}
```

Functional solution:

```js
function range(end, cur=[]) {
	if (cur.length >= end) return cur
	return range(end, [...cur, cur.length+1])
}
```

*This recursive solution suffers performance penalties however. See [this HN comment](https://news.ycombinator.com/item?id=34214150#34215700) for more info.*

I would have never thought to use recursion for this function before learning about functional programming. Now I might actually prefer the recursive solution.

## Why use functional programming

Functional programming has some amazing benefits:

**Avoid bugs related to mutable state.** Static typing removes the class of bugs caused by type errors. Similarly, functional programming removes the class of bugs caused by mutation. Every programmer has copied an array, modified the copy, then spent way too long trying to figure out how the original got modified (aka shallow copies vs. deep copies). Mutable state causes especially tricky bugs in large code bases. What shallow copy made the mutation? It could be anywhere!

**Write declarative code.** Imperative code describes *how* to do things. Declarative code describes *what* we are doing. Because of this, declarative code is easier to understand and modify. Think about how the original imperative solution has variables named `runningMax` and `runningSum`. It's tempting to name these variables `maxGroup` and `sum`, but that would be lying. They start at 0 and change over the course of the program. We are stuck with variable names describing *how* we do things. In the functional solution, `sortedGroups` describes exactly *what* we are doing.

**Write code that is easier to test.** In imperative code it is common to write void functions which mutate state. Games tend to define `update()` functions which mutate some state each tick. We can avoid mutation by taking game state as an argument and returning new state. Now our game is much easier to test too! We simply call `update` with some game state and assert that the result is what we expect. Imagine how hard it would be test the imperative `update` function!
