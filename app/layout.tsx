import React from "react"
import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { TranslationProvider } from '@/lib/i18n'
import { ThemeProvider } from '@/lib/theme'
import './globals.css'

const _spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-heading'
});
const _inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: 'TranslateAI - 智能翻译 保持格式 专业高效',
  description: '下一代AI翻译平台，支持 PPT、Word、Excel、PDF 多格式文档翻译，保持原有格式，专业术语库管理',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <TranslationProvider>
            {children}
          </TranslationProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
