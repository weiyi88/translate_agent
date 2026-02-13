import { Sparkles } from 'lucide-react'

export function LoginLeftPanel() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-1/2 min-h-screen bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] p-8 text-white overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Large Logo */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
            <Sparkles className="h-10 w-10 text-white" aria-hidden="true" />
          </div>
        </div>

        {/* Brand Text */}
        <h1 className="font-heading text-5xl font-bold mb-3 tracking-tight">
          TranslateAI
        </h1>
        <p className="text-xl font-medium text-white/90 mb-8">
          智能翻译平台
        </p>

        {/* Brand Description */}
        <p className="text-base text-white/75 leading-relaxed">
          支持 PPT、Word、Excel、PDF 等多种文档格式的智能翻译，完美保持原有格式，让翻译更专业、更高效。
        </p>

        {/* Illustration placeholder */}
        <div className="mt-12 space-y-4">
          <div className="h-48 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <div className="space-y-3">
              <div className="h-2 w-32 rounded-full bg-white/30" />
              <div className="h-2 w-28 rounded-full bg-white/20" />
              <div className="h-2 w-24 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
