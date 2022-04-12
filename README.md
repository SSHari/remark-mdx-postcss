<div align="center">

# remark-mdx-postcss

A [remark][remark] plugin to bundle a style tag with MDX content via [postcss][postcss].

</div>

## Contents

- [Installation](#installation)
- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Configure](#configure)
- [Examples](#examples)
  - [Example: basic postcss without plugins](#example-basic-postcss-without-plugins)
  - [Example: build tailwind styles dynamically](#example-build-tailwind-styles-dynamically)
- [Caveats](#caveats)
- [License](#license)

## Installation

This module is distributed via npm and can be installed as a project dependency:

```bash
npm install --save remark-mdx-postcss
```

## What is this?

Bundle an HTML style tag with your MDX for situations where you have css which needs to be created dynamically.

This plugin uses postcss under the hood to handle processing the css. It should support any postcss plugin. postcss is listed as a peer dependency and will need to be installed along side this package for things to work properly.

## When should I use this?

This plugin is useful for MDX content which is created dynamically. For example, if you store your MDX content in a database and use something like [mdx-bundler][mdx-bundler] to bundle on the fly, it can be useful to be able to generate styles for that MDX content that wouldn't already be included in your application.

## Configure

```js
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import remarkMdxPostCss from 'remark-mdx-postcss';

remark()
  // remark-mdx-postcss expects to process mdx
  .use(remarkMdx)
  .use(remarkMdxPostCss, {
    // Any valid css which will be
    // passed to the postcss processor
    input: '',
    // An array of valid postcss plugins...
    plugins: []
    // ...or a function which gets the remark
    // tree and virtual file (VFile) and
    // returns an array of postcss plugins
    plugins: (tree, file) => [],
    // MDX content
  }).process('');
```

See [`use()` in `unified`s readme][unified-use] for more info on how to use plugins.

## Examples

### Example: basic postcss without plugins

```ts
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import remarkMdxPostCss from 'remark-mdx-postcss';

const css = `
  p {
    color: red;
  }
`;

const mdx = `
  # Remark MDX PostCSS

  <div>This is some content.</div>
`;

remark()
  .use(remarkMdx)
  .use(remarkMdxPostCss, {
    input: css,
  })
  .process(mdx);
```

Yields:

```mdx
<style>
  p {
    color: red;
  }
</style>

# Remark MDX PostCSS

<div>This is some content.</div>
```

### Example: build tailwind styles dynamically

```js
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import remarkMdxPostCss from 'remark-mdx-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwind from 'tailwindcss';

// You may not need the @tailwind base
// if you use tailwind within your app.
const css = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
`;

const mdx = `
  # Remark MDX PostCSS

  <div className="font-bold">This is some content.</div>
`;

remark()
  .use(remarkMdx)
  .use(remarkMdxPostCss, {
    input: css,
    plugins: (_tree, file) => [
      tailwind({
        content: [{ raw: file.value, extension: `mdx` }],
        corePlugins: { preflight: false },
      }),
      autoprefixer(),
      cssnano(),
    ],
  })
  .process(mdx);
```

Yields:

```mdx
<style>.font-bold{font-weight:700;}</style>

# Remark MDX PostCSS

<div>This is some content.</div>
```

## Caveats

This plugin works by injecting an HTML style tag directly in the body of the document alongside the component which renders the MDX. While browsers will respect this style tag and correctly apply the styles, this is technically not valid CSS as per the [HTML spec][html-spec-style].

>     Contexts in which this element can be used:
>       Where metadata content is expected.
>       In a noscript element that is a child of a head element.

A modified approach involving building the styles and writing the style tag to the head of the document via JavaScript might work.

## License

[MIT][]

<!-- Definitions -->

[remark]: https://github.com/remarkjs/remark
[postcss]: https://postcss.org/
[mdx-bundler]: https://github.com/kentcdodds/mdx-bundler
[unified-use]: https://github.com/unifiedjs/unified#processoruseplugin-options
[html-spec-style]: https://html.spec.whatwg.org/multipage/semantics.html#the-style-element
[mit]: https://github.com/SSHari/remark-mdx-postcss/blob/master/LICENSE
