import { Sparkles } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  product: [
    { name: '功能特性', href: '#features' },
    { name: '价格方案', href: '#pricing' },
    { name: '更新日志', href: '#' },
    { name: '路线图', href: '#' },
  ],
  resources: [
    { name: '开发文档', href: '#' },
    { name: 'API 参考', href: '#' },
    { name: '示例代码', href: '#' },
    { name: '常见问题', href: '#' },
  ],
  company: [
    { name: '关于我们', href: '#' },
    { name: '博客', href: '#' },
    { name: '加入我们', href: '#' },
    { name: '联系方式', href: '#' },
  ],
  legal: [
    { name: '隐私政策', href: '#' },
    { name: '服务条款', href: '#' },
    { name: '使用许可', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))]">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight">
                TranslateAI
              </span>
            </Link>
            <p className="mb-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              下一代 AI 翻译平台，让文档翻译更智能、更高效。支持 PPT、Word、Excel、PDF 多格式翻译。
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 TranslateAI. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">产品</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">资源</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">公司</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-wrap gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Built with Next.js and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
