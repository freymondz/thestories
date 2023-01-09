# thestories

Learning how to use `D3.js` to create static visualization. I mostly just used the premade functions from [observablehq](https://observablehq.com/).

## D3.js and Node.js

Due to the nature of JavaScript and the disparate standardization of everything between `Node.js` and the browsers valid JavaScript in `Node.js` is not always valid in the browser. Getting proper IDE support for `D3.js` is very annoying.

We can import `D3.js` using the `<script>` tag and embed JavaScript in HTML but that means no Intellisense. Installing `D3.js` with `NPM` gives us Intellisense but the import system used by `D3.js` is not compatiable with how the browser imports external libraries. We can use rollup or any other JavaScript bundler but that seems incredibly overkill for a simple project.

However we can take advantage of the fact that VSCode comes bundled with TypeScript. We can create a `index.d.ts` file that acts as a proxy for the types exposed by `D3.js`. This allows us to get Intellisense and type checking in VSCode without having to use a bundler.

By adding this to the top of the JavaScript file we're working on we can get Intellisense and type checking.

```js
/// <reference path="index.d.ts" />
const d3 = window.d3;
```

[Souce](https://griffa.dev/posts/type-checking-global-javascript-libraries-in-vs-code-for-when-you-just-want-learn-and-code./)

Make sure to still be importing `D3.js` in HTML using the `<script>` tag.
