import postcss from 'postcss';
import type { AcceptedPlugin } from 'postcss';
import type { Transformer } from 'unified';
import type { Root } from 'remark-mdx';
import type { VFile } from 'vfile';

export type PostCssPlugins = AcceptedPlugin[] | ((tree: Root, file: VFile) => AcceptedPlugin[]);
export type RemarkMdxPostCssOptions = { plugins?: PostCssPlugins; input?: string };

export default function remarkMdxPostCss({ plugins = [], input = '' }: RemarkMdxPostCssOptions): Transformer<Root> {
  return async function transformer(tree, file) {
    const postCssPlugins = typeof plugins === 'function' ? plugins(tree, file) : plugins;
    const { css } = await postcss(...postCssPlugins).process(input, { from: undefined });

    tree.children.unshift({
      type: 'mdxJsxFlowElement',
      name: 'style',
      attributes: [],
      // @ts-ignore - this is actually a valid type
      children: [{ type: 'text', value: css }],
    });
  };
}
