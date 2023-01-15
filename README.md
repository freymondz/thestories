# thestories

Learning how to use `D3.js` to create static visualization. I mostly just used the premade functions from [observablehq](https://observablehq.com/).

## D3.js and Node.js

By using `d3.js` in a Node.js environment, we get intellisense and types, making it easier to learn how to use the library. Unfortunately, to import `d3.js` in Node.js we use bare imports like `import * as d3 from 'd3'`. However the browser doesn't recognize bare imports. We can use [import maps](https://uploadcare.com/blog/import-maps-101/) to help the browser recognize the imports.

Place this HTML in the `<head>` of your HTML file before you define your `index.js`.

```html
<script type="importmap">
    {
        "imports": {
            "d3": "https://cdn.jsdelivr.net/npm/d3@7/+esm"
        }
    }
</script>
```

Do be aware that [Safari](https://caniuse.com/import-maps) does not currently support this feature in its general release version.
