"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { supabase } from "@/lib/supabase/browser-client"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

interface SearchLayoutProps {
  children: ReactNode
}

export default function SearchLayout({ children }: SearchLayoutProps) {
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return null
  }

  return <Dashboard>{children}</Dashboard>
}
