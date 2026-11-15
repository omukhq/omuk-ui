// The `render` prop, as Base UI has it: a part can be drawn as another
// element (`render={<a href="…" />}`), which gets the part's props and ref
// merged into its own. Shared by every component in this folder.
import {
  type ComponentPropsWithRef,
  cloneElement,
  createElement,
  isValidElement,
  type JSX,
  type ReactElement,
  type Ref,
  type RefCallback,
  useMemo,
} from 'react';

type Props = Record<string, unknown>;

/** An element to draw the part as, or a function that returns one. */
export type RenderProp =
  | ReactElement
  | ((props: Props, state: Props) => ReactElement);

/** A tag's props, plus `render`. Base UI's `useRender.ComponentProps`. */
export type RenderProps<Tag extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithRef<Tag> & { render?: RenderProp };

/** Calls each ref; React runs the returned cleanup on detach. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') {
        const cleanup = ref(node);
        return typeof cleanup === 'function' ? cleanup : () => ref(null);
      }
      if (ref) {
        ref.current = node;
        return () => {
          ref.current = null;
        };
      }
      return undefined;
    });
    return () => {
      for (const cleanup of cleanups) cleanup?.();
    };
  };
}

/** One stable ref for two: a new one each render would detach and reattach. */
export function useMergedRef<T>(a: Ref<T> | undefined, b: Ref<T> | undefined) {
  return useMemo(() => mergeRefs(a, b), [a, b]);
}

function isHandler(key: string) {
  return (
    key.length > 2 && key.startsWith('on') && key[2] === key[2]?.toUpperCase()
  );
}

/**
 * The part's props (`ours`) under the render element's (`theirs`), as Base
 * UI merges them: their class names first, their handler first and then
 * ours, their value for anything else.
 */
export function mergeProps(ours: Props, theirs: Props): Props {
  const merged = { ...ours };
  for (const key in theirs) {
    const mine = ours[key];
    const value = theirs[key];
    if (key === 'className') {
      merged.className = [value, mine].filter(Boolean).join(' ') || undefined;
    } else if (key === 'style') {
      merged.style = { ...(mine as object), ...(value as object) };
    } else if (
      isHandler(key) &&
      typeof mine === 'function' &&
      typeof value === 'function'
    ) {
      merged[key] = (...args: unknown[]) => {
        value(...args);
        mine(...args);
      };
    } else if (value !== undefined) {
      merged[key] = value;
    }
  }
  return merged;
}

/**
 * Draws `tag` with `props`, or `render` with them merged in. A hook: the
 * merged ref must keep its identity between renders.
 */
export function useRender(
  tag: keyof JSX.IntrinsicElements,
  { ref, ...props }: Props,
  render?: RenderProp,
  state: Props = {},
) {
  const element = isValidElement<Props>(render) ? render : null;
  const merged = useMergedRef(
    ref as Ref<unknown> | undefined,
    element?.props.ref as Ref<unknown> | undefined,
  );
  if (typeof render === 'function') return render({ ...props, ref }, state);
  if (element) {
    return cloneElement(element, {
      ...mergeProps(props, element.props),
      ref: merged,
    });
  }
  return createElement(tag, { ...props, ref });
}
