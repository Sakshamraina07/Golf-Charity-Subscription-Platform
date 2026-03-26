'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'

export default function SubscribeSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    // Poll every 2 seconds to check if subscription is active
    const interval = setInterval(async () => {
      const res = await fetch('/api/subscribe/verify')
      const data = await res.json()

      if (data.active) {
        clearInterval(interval)
        router.push('/dashboard')
      } else {
        setAttempts(a => a + 1)
        // After 10 attempts (20s), force redirect anyway
        if (attempts > 10) {
          clearInterval(interval)
          router.push('/dashboard')
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [attempts, router])

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 text-white">
      <CheckCircle className="w-16 h-16 text-emerald-400" />
      <h1 className="text-3xl font-black">Payment Successful!</h1>
      <p className="text-zinc-400">Setting up your account...</p>
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  )
}
