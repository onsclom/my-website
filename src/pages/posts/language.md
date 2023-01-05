---
layout: ../../layouts/BlogLayout.astro
title: "Thoughts About a New Scripting Language"
pubDate: 2022-12-17
---

What makes a programming language a scripting language? Stack Overflow declared this question as "opinion-based" in [this thread](https://stackoverflow.com/questions/17253545/scripting-language-vs-programming-language). While the thread is now closed, I like the top answer:

> Scripting languages are programming languages that don't require an explicit compilation step.

I don't want to write a compiler. I just want to design a language, write an interpreter for it, and start using it. So there it is, I am designing a new scripting language!

## Why Make a New Language?

I have been wanting to design a programming language for a while now. There are things I like about different languages and I want to bring them together into one. Here are some goals I have for the language:
1. It should be easy to solve programming challenges like [Advent of Code](https://adventofcode.com/) with the language
2. It should be easy to make cool things with the language 
	- I think interactive programs that have GUIs like tools or games tend to be cool
3. I should be able to enjoy using the language
4. I should be able to convince non-programmers that using my language is a fun way to start programming 
	- People who are attached to their current languages and tools are harder to convince, so I don't think that's a reasonable goal

Now I will go into the qualities I want this language to have.

## Simple

I really enjoy the simplicity of C and Lua. It's totally possible to learn the entirety of these languages in a few days. In most modern languages there tends to be so much syntactic sugar that you can never fully learn the language. When reading other people's code, it is likely that they are using language features you never knew existed. 

To play devil's advocate, this is not an entirely bad thing. Syntactic sugar allows more experienced users to be faster and more productive. Also, catering your language to multiple types of audiences makes for more users. For example, if you enjoy OOP then you can use a subset JavaScript and be decently happy while functional programmers use a totally different subset and are also decently happy.  However, I think a large amount of productivity can come from a small set of features, and I want to experiment using that as a hypothesis.

## Concise and Readable

I really enjoy the conciseness and readability of Python. I am not talking about syntactic sugar like list comprehensions, but rather things like block structure being inferred using whitespace. If you use a language with C-like syntax and sane formatting, it is likely you have lines like this all over your code:

```C
      }
    }
  }
}
```

If you infer structure using whitespace, these lines completely go away. This is important because being able to see more meaningful code at a glance makes for a better developer experience. I also enjoy decisions like how Python uses `and` instead of `&&`, and Python does not require parenthesis around conditions in statements like `if condition:`.

## Functional

While I haven't used a true functional programming language yet, I have been experimenting with using a functional style in JavaScript. Doing this made me realize that functional programming has some great advantages. However, doing things in a purely functional style all the time does not really seem optimal so finding the right balance here is important.

Functional programming with a good standard library can give a lot of the advantages that syntax sugar give without the excess complexity. Look at this purely functional solution to Advent of Code day 2022 part 1:

```javascript
Math.max(
  ...input.split("\n\n")
    .map(g=>g.split("\n").map(Number))
    .map(g=>g.reduce((a,b)=>a+b)))
```

`input` is a string containing containing groups of numbers where the individual numbers are separated by "\n", and the groups are separated by "\n\n". The goal is to sum each group up and find the largest. The language features used here are pretty minimal. We have function calls, the `...` spread operator, and lambda functions. The spread operator could be eliminated with a better standard library. Functions like `map`, `filter`, and `reduce` paired with lambda functions are really expressive. And this expressiveness comes without the baggage of syntactic sugar.

If we make a our language functional, then we need a very minimal set of language features. We don't need OOP features like classes or inheritance. We don't "need" loop statements since everything can be done recursively. In fact, we don't even really need control statements in general. `if` could be described as a function, and it would be a more sensible default to always return something. Then there would be no distinction between ternary statements and regular if statements. In fact, everything should probably return a value by default. Functions should return their last expression by default.

If it was a true purely functional language, then we wouldn't even include variable declarations and assignment. However, I think this is going too far. Sometimes problems are solved easier without using a purely functional approach.

## Conclusion

There are a lot of things that go into a scripting language. There's the syntax, semantics, standard library, and even tools like the interpreter. I could go on forever and get into gritty details like how the interpreter's error messages should work. However, I think this is a good point to stop. This part describe the primary goals of my language. In the next part I will probably start giving concrete examples. I'd like to get things working and useable as quickly as possible. Even if it's just a subset of the language with hack-y code.
