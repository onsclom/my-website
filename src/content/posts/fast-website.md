---
title: "Making My Website Fast"
pubDate: 2023-12-15
---

I decided to remake my website for the 1000th time, but this time it wasn't
because I wanted to try some new tech. This time, I wanted to see how fast I
could make my site load! This post details the journey. I'm by no means an
expert on this stuff, so there will be probably be mistakes. (If you are an
expert, I'd love to hear about what I got wrong or what I missed!)

## Minimizing Resources

For a while now, I've known that a big part of optimizing page speed is simply
minizing unnecessary resources. An awesome site that displays the advantages of
this is [Bear Blog](https://bearblog.dev/)! It feels super fast and it just
works. But, we don't need to rely on feeling.

The network tab of chrome dev tools gives some great information. With cache
disabled, I get an average page load of ~200ms. And the resource view is very
refreshing. There are no external style sheets, JavaScript, or font files. Bear
Blog's landing page is just a single 3.4 kB HTML file.

Let's compare this to a landing page that takes a totally different approach,
[Medium](https://medium.com/). I get an average page load of ~600ms. That's 3x
as long as Bear Blog! And there's tons of render blocking CSS and JS!

So how small should my website be? Should it be mostly unstyled HTML like
[Bjarne Stroustrup's homepage](https://www.stroustrup.com/)? Thankfully there's
an awesome article that covers this.
[Why your website should be under 14kB in size](https://endtimes.dev/why-your-website-should-be-under-14kb-in-size/)
provides a very reasonable size limit. When you take into account a minimization
step and gzip, 14kB is plenty for render blocking content.

## Inlining Critical Content

Something new I learned in this process is that critical resources should be
inlined in the HTML. When you make external files for critical CSS and JS, you
create unnecessary waterfalls for the first render. The browser would need to
request the HTML, parse the HTML, and only after parsing the HTML it will
finally request the critical external CSS and JS. Bear Blog has the right idea
here.

However, things get complex when styles are reused by multiple pages on a site.
With lots of CSS, it might be worth it to make it an external sheet so that
browsers can cache it and reuse it for different pages. Based on
[Extract Critical CSS](https://web.dev/articles/extract-critical-css), it sounds
like inlining critical CSS and lazy loading the rest is the way to go. That lazy
loaded CSS can be reused on multiple pages, and inlined CSS should be generated
per page. Tools like [Critters](https://github.com/GoogleChromeLabs/critters)
help with this!

## In Practice

So how did I go about rewriting my site using this info? After talking so much
about low level HTML and CSS you might think frameworks would just complicate
things, and that is somewhat true! Before this rewrite, my site was built using
SvelteKit and Tailwind.

Tailwind builds an external style sheet by default which complicated things.
Also,
[Classic rock, Mario Kart, and why we can't agree on Tailwind](https://joshcollinsworth.com/blog/tailwind-is-smart-steering)
made me realize that for something as personal as my website, CSS might be a
better choice anyway. SvelteKit makes it easy to prerender specific routes, but
I was bit more confused about how to inline CSS. SvelteKit was doing a lot of
magic I didn't really understand, and I just wanted more control. It could
totally be a skill issue. With more time maybe I would have figured it out. But
I decided to go another direction instead.

So did I go straight to writing raw HTML and CSS directly? Well, I have some
requirements for my site that would've made that a bit tricky. For one, my site
has multiple pages. Each page reuses the same shell. Also, I have a bunch of
markdown writing. I want to continue writing with markdown and have that writing
be converted to HTML automatically. Basically, I'd benefit a lot from using a
static site generator.

I spent a lot of time thinking about how I wanted to approach this. I even
started making [my own SSG with Bun](https://bun-blog.vercel.app/) that was
heavily inspired by Bear Blog! Hower, I landed on using one of my favorite new
tools.

## Astro is Awesome

Astro handled all my requirements as defaults, and it even went above and
beyond. I used a modern component based workflow and my pages get rendered as
static HTML. It automatically inlined my CSS. Content collections made rendering
my writing super easy. And now, I have access to all the flexibility and power
of Vite for extending my site.

This wasn't even my first time using Asto. Before the SvelteKit verison, this
website was also built using Astro. But since then, Astro got even nicer to use.
I think it's the perfect choice for my site now.

<!-- COOL THINGS:
- system font
- emoji favicon
- minimal css
- super small size

optimal reading length
center page
system font
-->

## What I Built

The resulting site is pretty simple. There aren't any

## Conclusion

I think the experiment was really successful! My website is super fast.

It's a bit minimal and I have a lot more stuff I want to add, but for now I love
my fast and minimal site.
