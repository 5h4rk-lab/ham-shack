import { useEffect, useState } from 'react'
import { loadPool } from './pool'
export function usePool(cert) {
  const [pool, setPool] = useState(null)
  useEffect(() => {
    let live = true
    setPool(null)
    loadPool(cert).then((p) => live && setPool(p))
    return () => { live = false }
  }, [cert])
  return pool
}
