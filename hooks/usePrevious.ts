import { useEffect, useState } from 'react'

export function usePrevious<T>(value: T): T | undefined {
  const [previous, setPrevious] = useState<T | undefined>(undefined)

  useEffect(() => {
    setPrevious(value)
  }, [value])

  return previous
}
