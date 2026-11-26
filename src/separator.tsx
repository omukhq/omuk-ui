'use client';

import type { ComponentPropsWithRef } from 'react';
import { type RenderProp, useRender } from './render';
import { cn } from './utils';

type SeparatorProps = ComponentPropsWithRef<'div'> & {
  orientation?: 'horizontal' | 'vertical';
  render?: RenderProp;
};

function Separator({
  className,
  orientation = 'horizontal',
  render,
  ...props
}: SeparatorProps) {
  return useRender(
    'div',
    {
      role: 'separator',
      'aria-orientation': orientation,
      'data-orientation': orientation,
      'data-slot': 'separator',
      className: cn(
        'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
        className,
      ),
      ...props,
    },
    render,
  );
}

export { Separator };
