import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Sparkles, BookOpen, Globe, CheckCircle2, Code } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: '多格式支持',
    description: '支持 PPT、Word、Excel、PDF 等主流文档格式，一站式翻译解决方案',
  },
  {
    icon: Sparkles,
    title: 'AI 智能翻译',
    description: '采用先进的大语言模型，提供准确、流畅、符合上下文的专业翻译',
  },
  {
    icon: BookOpen,
    title: '术语库管理',
    description: '自定义术语库，确保专业术语翻译的一致性和准确性',
  },
  {
    icon: Globe,
    title: '多语言对话',
    description: '支持 100+ 种语言互译，覆盖全球主要语言和方言',
  },
  {
    icon: CheckCircle2,
    title: '格式完美保留',
    description: '智能识别并保持原文档的格式、样式、图表和排版',
  },
  {
    icon: Code,
    title: 'API 集成',
    description: '提供 RESTful API，轻松集成到您的工作流和应用系统',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border bg-background px-4 py-24 md:px-6 md:py-32">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl">
            强大功能 极致体验
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground md:text-lg leading-relaxed">
            专为专业用户打造的翻译工具，让文档翻译更智能、更高效
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:bg-card/90 dark:hover:bg-card focus-within:border-primary/50 focus-within:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/20">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <CardTitle className="font-heading text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
