import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function PricingPageCta() {
  return (
    <section className="relative overflow-hidden px-4 py-24 md:px-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[rgb(var(--primary))]/10 via-[rgb(var(--secondary))]/10 to-[rgb(var(--primary))]/10" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" aria-hidden="true" />

      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="mb-6 font-heading text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
          准备好开始了吗？
        </h2>
        <p className="mb-8 text-pretty text-lg text-muted-foreground leading-relaxed">
          加入数千名用户，体验智能翻译带来的便利。选择适合您的方案，立即开始翻译。
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            size="lg"
            className="h-12 gap-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] px-8 text-base font-semibold text-white shadow-lg hover:opacity-90 hover:shadow-xl active:scale-95 transition-all duration-200"
            asChild
          >
            <Link href="/signup">
              免费开始
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-2 px-8 text-base font-semibold bg-transparent hover:bg-muted/50 hover:border-primary/50 active:scale-95 transition-all duration-200"
          >
            联系销售
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          无需信用卡，免费试用所有功能。支持随时升级。
        </p>
      </div>
    </section>
  )
}
