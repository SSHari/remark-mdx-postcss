import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwind from 'tailwindcss';
import remarkMdxPostCss from './index';

test('remark-mdx-postcss creates an empty style tag without any options', async () => {
  const result = await remark().use(remarkMdx).use(remarkMdxPostCss, {}).process('');

  expect(result.value).toMatchInlineSnapshot(`
    "<style>

    </style>
    "
  `);
});

test('remark-mdx-postcss creates a style tag with the correct css based on the input', async () => {
  const css = String.raw`
    p {
      color: red;
    }
  `;

  const mdx = String.raw`
    # Title

    <SomeComponent />
  `;

  const result = await remark().use(remarkMdx).use(remarkMdxPostCss, { input: css }).process(mdx);
  expect(result.value).toMatchInlineSnapshot(`
    "<style>

          p {
            color: red;
          }
        
    </style>

    # Title

    <SomeComponent />
    "
  `);
});

test('remark-mdx-postcss creates a style tag which has been run through the autoprefixer, cssnano, and tailwindcss plugins', async () => {
  const css = String.raw`
    @tailwind components;
    @tailwind utilities;
  `;

  const mdx = String.raw`
    <div className="font-normal hover:font-bold overline">I'm a div</div>
  `;

  const result = await remark()
    .use(remarkMdx)
    .use(remarkMdxPostCss, {
      input: css,
      plugins: (_, file) => [
        tailwind({
          // @ts-ignore
          content: [{ raw: file.value, extension: `mdx` }],
          corePlugins: { preflight: false },
        }),
        autoprefixer(),
        cssnano(),
      ],
    })
    .process(mdx);

  expect(result.value).toMatchInlineSnapshot(`
    "<style>
      .font-normal{font-weight:400}.overline{-webkit-text-decoration-line:overline;text-decoration-line:overline}.hover\\\\\\\\:font-bold:hover{font-weight:700}
    </style>

    <div className=\\"font-normal hover:font-bold overline\\">I'm a div</div>
    "
  `);
});
