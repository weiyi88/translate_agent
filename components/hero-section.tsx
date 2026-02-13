'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, Play, X } from 'lucide-react'

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20 px-4 py-24 md:px-6 md:py-32 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 border border-primary/20 bg-primary/5 px-3 py-1.5 text-primary hover:bg-primary/10 transition-colors duration-200"
          >
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">
              下一代 AI 翻译平台
            </span>
          </Badge>

          <h1 className="mb-6 font-heading text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            智能翻译 保持格式
            <br />
            <span className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] bg-clip-text text-transparent">
              专业高效
            </span>
          </h1>

          <p className="mb-8 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
            支持 PPT、Word、Excel、PDF 多格式文档翻译
            <br className="hidden sm:block" />
            完美保持原有格式，专业术语库管理，让翻译更智能
          </p>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="h-12 gap-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] px-8 text-base font-semibold text-white shadow-lg hover:opacity-90 hover:shadow-xl active:scale-95 transition-all duration-200"
              asChild
            >
              <Link href="/login">
                免费开始翻译
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-2 border-border px-8 text-base font-semibold text-foreground bg-card/50 hover:bg-muted hover:border-primary/50 active:scale-95 transition-all duration-200 gap-2"
              onClick={() => setShowVideo(true)}
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              查看演示
            </Button>
          </div>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden shadow-2xl bg-card animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full h-10 w-10"
              onClick={() => setShowVideo(false)}
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="aspect-video bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-950 dark:to-orange-950 flex flex-col items-center justify-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 flex items-center justify-center shadow-xl">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
              <p className="text-lg font-medium text-foreground">TranslateAI 产品演示</p>
              <p className="text-sm text-muted-foreground">视频即将上线，敬请期待</p>
            </div>
          </div>
        </div>
      )}

          <div className="mb-12 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:gap-6">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              <span>免费试用</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              <span>无需信用卡</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              <span>秒级处理</span>
            </div>
          </div>

          <Card className="mx-auto w-full max-w-4xl overflow-hidden border-2 shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 p-6">
              <div className="flex h-full flex-col gap-4 rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500" aria-hidden="true" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" aria-hidden="true" />
                  <div className="h-3 w-3 rounded-full bg-green-500" aria-hidden="true" />
                  <span className="ml-auto text-xs text-muted-foreground">
                    翻译工作台
                  </span>
                </div>
                <div className="grid flex-1 gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="h-3 w-20 rounded bg-muted" aria-hidden="true" />
                    <div className="h-20 rounded-lg border bg-background p-3">
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded bg-muted" aria-hidden="true" />
                        <div className="h-2 w-5/6 rounded bg-muted" aria-hidden="true" />
                        <div className="h-2 w-4/6 rounded bg-muted" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-20 rounded bg-primary/20" aria-hidden="true" />
                    <div className="h-20 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded bg-primary/30" aria-hidden="true" />
                        <div className="h-2 w-5/6 rounded bg-primary/30" aria-hidden="true" />
                        <div className="h-2 w-4/6 rounded bg-primary/30" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" aria-hidden="true" />
    </section>
  )
}
