---
title: 'JavaScript is Misunderstood'
pubDate: 2022-12-24
---

Many people hate JavaScript for the wrong reasons. Some common misconceptions I see are:

- JavaScript is synonymous with NPM
- Web APIs are a total mess
- The language itself is a total mess

Ok, I admit it. There is _some_ truth to each of these:

- Most web developers are working on projects with an absurd amount of NPM package
- Inconsistencies exist between browsers
- `==`, `var`, `this`, callbacks etc.

_But_, focusing on the negatives means we have to ignore what makes JavaScript amazing. JavaScript
is often the most **enjoyable** and **pragmatic** way to bring interactive apps to life. It has
everything you need.

The language is **expressive**. Methods like `map`, `filter`, and `reduce` make complex
functionality simple. The destructuring syntax is a joy to use.

Web APIs make awesome projects possible. Want graphics for your game? Check out the
[Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). Want to add controller
support? Check out the [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API).
Want to use your piano as input for an app? Check out the
[MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API).

JavaScript was _made_ to work with HTML and CSS, battle-tested domain specific languages. HTML, CSS,
and JavaScript combine to elegantly describe user interfaces. Even [Qt](https://www.qt.io/)
recognized this. They invented [QML](https://doc.qt.io/qt-6/qtqml-index.html) to get the benefits of
a domain specific declarative language.

Web apps are shareable by default. When something is on the web, any device with a web browser can
interact with it. Executables may be more efficient and native, but they lose share-ability.

One of my favorite things to code is snake. It is a simple game, but is _any_ game _actually_ simple
to implement? You need to draw graphics, handle non-trivial state, and handle inputs.

Think about programming snake in your favorite programming languages. Will you need 3rd party
libraries or frameworks? How many tools will you have to use? How shareable will the result be?

I coded snake in ~50 lines of pretty clear and simple JavaScript. No libraries or frameworks were
needed. GitHub pages means I could share it just by sharing the
[code](https://github.com/onsclom/html5-snake). Try it out
[here](https://onsclom.github.io/html5-snake/). If your device has a modern web browser, it will
work well.

JavaScript is a huge language with _many_ rough edges. _But_, some parts are really great. Many
people think we need to start over and totally replace JavaScript. I think we should recognize the
great parts and build off those.
