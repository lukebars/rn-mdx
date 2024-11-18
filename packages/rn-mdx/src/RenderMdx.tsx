import React, { useMemo } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import markdownComponents from './markdownComponents';
import { styles } from './style/styles';

const defaultScope = {};

interface RenderMdxProps {
  children: string;
  components?: Record<string, React.ComponentType<any>>;
  scope?: Record<string, any>;
  componentStyle?: Record<string, any>;
}

export async function RenderMdx({
  children,
  components = {},
  scope = {},
  componentStyle = {},
}: RenderMdxProps) {
  const defaultComponents = useMemo(
    () => markdownComponents(styles(componentStyle)),
    [componentStyle]
  );

  const contentScope = { ...defaultScope, ...scope };
  const mdxComponents = useMemo(
    () => ({ ...defaultComponents, ...components }),
    [components, defaultComponents]
  );

  const { default: Content } = await evaluate(children, {
    ...runtime,
    scope: contentScope
  });

  return <Content components={mdxComponents} />;
}
