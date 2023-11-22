import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => 
    <h1 className="text-5xl">{children}</h1>,
    ...components,
    ol: ({children}) => <ol className="text-gray-500">{children}</ol>,
    b: ({children}) => <h1 className="my-4 text-2xl">{children}</h1>
    
  };
}
