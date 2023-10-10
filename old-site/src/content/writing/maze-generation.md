---
layout: ../../layouts/BlogLayout.astro
title: "C vs TypeScript Performance"
pubDate: 2023-08-05
---

I wanted to share a fun little coding adventure. It started with me making a maze generator in ANSI C. You give it the size and it will print a randomly generated maze:

```
>./maze 5
###########
#     #   #
##### ### #
#   #     #
# ####### #
# #     # #
# # # # # #
# # # # # #
# # # ### #
#   #     #
###########
```

This was cool and all, but it made me curious. How much faster is this code than the same algorithm written in TypeScript?

So, I rewrote it in TypeScript. In both versions, I commented out the code that prints the maze, leaving just the generation code. I compiled the C program with `gcc maze.c -O3` for max performance. I ran the TypeScript program with `deno run`. I timed them both using `time` for generating a size 1,000 maze and a size 5,000 maze.

[C code](https://gist.github.com/onsclom/3df0815ed2e3c1f30e8483234e9b643c)

[TypeScript code](https://gist.github.com/onsclom/bf07edb965b33cf05c96eaa31c1f8602)

`time` results:
```
size of 1000:

  ./maze 1000  
  0.05s user 0.01s system 9% cpu 0.544 total

  deno run maze.ts 1000 
  0.18s user 0.04s system 123% cpu 0.179 total

size of 5000:

  ./maze 5000
  0.66s user 0.06s system 99% cpu 0.725 total

  deno run maze.ts 5000  
  3.81s user 0.46s system 114% cpu 3.739 total
```

C is almost x8 faster than TypeScript at generating size 5000 mazes, woah! TypeScript reaches the heap limit when generating a size 10,000 maze. C will happily generate a size 80,000 maze in 3 minutes.
