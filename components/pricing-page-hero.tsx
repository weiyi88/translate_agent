'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

export function PricingPageHero() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section className="border-b bg-gradient-to-b from-background to-muted/20 px-4 py-20 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-4 font-heading text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
            灵活的定价，按需选择
          </h2>
          <p className="mb-12 max-w-2xl text-pretty text-lg text-muted-foreground">
            从免费开始，随业务增长随时升级
          </p>

          <div className="mb-12 flex items-center gap-4 rounded-lg border bg-muted/30 p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 font-medium transition-all duration-200 rounded-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                !isAnnual
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={!isAnnual}
            >
              月付
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative px-6 py-2 font-medium transition-all duration-200 rounded-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isAnnual
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={isAnnual}
            >
              年付
              {isAnnual && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white text-xs">
                  省20%
                </Badge>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
