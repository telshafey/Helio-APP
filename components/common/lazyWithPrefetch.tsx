import React from 'react';

// FIX: Switched from extending an interface to using a type alias with an intersection.
// This is safer for augmenting external/magic types like React.LazyExoticComponent
// and avoids potential issues with TypeScript's JSX type checking.
type PrefetchableComponent<T extends React.ComponentType<any>> = 
  React.LazyExoticComponent<T> & {
    preload: () => Promise<{ default: T }>;
  };

/**
 * A wrapper around React.lazy that adds a static .preload() method to the component.
 * This allows for prefetching the component's code before it is rendered.
 * @param factory A function that returns a dynamic import() call.
 */
export function lazyWithPrefetch<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): PrefetchableComponent<T> {
  const LazyComponent = React.lazy(factory);
  (LazyComponent as any).preload = factory;
  return LazyComponent as PrefetchableComponent<T>;
}
