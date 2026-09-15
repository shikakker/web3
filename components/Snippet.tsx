import type { PropsWithChildren } from 'react'

export function Snippet({ children }: PropsWithChildren) {
  return <pre className="code-block">{children}</pre>
}
