'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'

function SuccessContent() {
  const router = useRouter()
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/subscribe/verify')
        const data = await res.json()

        if (data.active) {
          clearInterval(interval)
          router.push('/dashboard')
        } else {
          setAttempts(a => {
            if (a > 10) {
              clearInterval(interval)
              router.push('/dashboard')
            }
            return a + 1
          })
        }
      } catch {
        setAttempts(a => a + 1)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 text-white">
      <CheckCircle className="w-16 h-16 text-emerald-400" />
      <h1 className="text-3xl font-black">Payment Successful!</h1>
      <p className="text-zinc-400">Setting up your account...</p>
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  )
}

export default function SubscribeSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}