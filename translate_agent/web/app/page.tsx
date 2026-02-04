/**
 * Landing Page - 首页
 * AI 文档翻译平台着陆页
 */
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Globe,
  Sparkles,
  ArrowRight,
  Check,
  Github,
  Chrome,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-xl">TranslateAI</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                功能
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                价格
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                文档
              </Link>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="btn-primary">
                  免费开始
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-bg -z-10" />
        <div className="absolute inset-0 grid-bg -z-10 opacity-50" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                新一代 AI 文档翻译平台
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              智能翻译
              <span className="text-gradient"> 保持格式</span>
              <br />
              专业高效
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              支持 PPT、Word、Excel、PDF 等多种格式，
              <br className="hidden sm:block" />
              使用最新 AI 技术，保留原始排版和格式
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/signup">
                <Button size="lg" className="btn-primary text-lg px-8 py-6 shadow-lg">
                  免费开始翻译
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  查看演示
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>免费试用</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>无需信用卡</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>秒级处理</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative max-w-5xl mx-auto">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-2xl" />

              {/* Main Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Fake UI */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left - Upload */}
                    <div className="space-y-4">
                      <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-dashed border-primary-200 flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-primary-400 mx-auto mb-3" />
                          <p className="text-gray-600 font-medium">拖拽文件到此处</p>
                          <p className="text-sm text-gray-400 mt-1">支持 PPT, Word, Excel, PDF</p>
                        </div>
                      </div>
                      <Button className="w-full btn-primary">
                        选择文件
                      </Button>
                    </div>

                    {/* Right - Options */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          目标语言
                        </label>
                        <select className="input">
                          <option>English</option>
                          <option>日本語</option>
                          <option>한국어</option>
                          <option>Français</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          AI 模型
                        </label>
                        <select className="input">
                          <option>GPT-4o (推荐)</option>
                          <option>Claude 3.5 Sonnet</option>
                          <option>GPT-4o Mini (快速)</option>
                        </select>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full btn-primary" size="lg">
                          开始翻译
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              强大的功能
              <span className="text-gradient">简单易用</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们提供专业级的翻译工具，让文档翻译变得前所未有的简单
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card card-hover p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                多格式支持
              </h3>
              <p className="text-gray-600 leading-relaxed">
                支持 PPT、Word、Excel、PDF 等多种文档格式，保留原始排版、字体、颜色等所有样式
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card card-hover p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                AI 智能翻译
              </h3>
              <p className="text-gray-600 leading-relaxed">
                使用最新的 GPT-4o、Claude 3.5 等大模型，翻译准确度接近人工水平，支持 100+ 语言
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card card-hover p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                术语库管理
              </h3>
              <p className="text-gray-600 leading-relaxed">
                自定义术语库，确保专业术语翻译一致性，支持批量导入导出，团队共享
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card card-hover p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-6">
                <Chrome className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                对话翻译
              </h3>
              <p className="text-gray-600 leading-relaxed">
                实时文本翻译功能，支持流式输出，即时查看翻译结果，适合即时通讯和文档编辑
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card card-hover p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-6">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                格式保留
              </h3>
              <p className="text-gray-600 leading-relaxed">
                完美保留原文档的所有格式，包括字体、颜色、大小、对齐方式、图片位置等
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card card-hover p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-6">
                <Github className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                API 集成
              </h3>
              <p className="text-gray-600 leading-relaxed">
                提供 RESTful API，轻松集成到您的现有系统，支持批量处理和自动化工作流
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              灵活的定价
              <span className="text-gradient">按需选择</span>
            </h2>
            <p className="text-xl text-gray-600">
              从免费开始，随业务增长升级
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="card p-8">
              <h3 className="font-display text-xl font-semibold mb-2">免费版</h3>
              <p className="text-gray-600 mb-6">适合个人试用</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">¥0</span>
                <span className="text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>每月 10 页翻译</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>基础 AI 模型</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>社区支持</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                免费开始
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="card p-8 border-2 border-primary-500 relative shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="badge badge-primary">最受欢迎</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">专业版</h3>
              <p className="text-gray-600 mb-6">适合专业用户</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">¥99</span>
                <span className="text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>无限翻译页数</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>所有 AI 模型</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>术语库管理</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>优先支持</span>
                </li>
              </ul>
              <Button className="w-full btn-primary">
                立即订阅
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="card p-8">
              <h3 className="font-display text-xl font-semibold mb-2">企业版</h3>
              <p className="text-gray-600 mb-6">适合团队和企业</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">定制</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>私有化部署</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>定制功能开发</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>专属技术支持</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>SLA 保障</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                联系我们
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-semibold text-xl text-white">TranslateAI</span>
              </div>
              <p className="text-sm">
                新一代 AI 文档翻译平台
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">产品</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">功能</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">价格</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">资源</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-white transition-colors">文档</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">博客</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">支持</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">公司</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">关于我们</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2026 TranslateAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
