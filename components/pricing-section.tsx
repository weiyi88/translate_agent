import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

const plans = [
  {
    name: '免费版',
    price: '¥0',
    period: '/月',
    description: '适合个人用户和小型项目',
    features: [
      '每月 10 次翻译',
      '支持所有文档格式',
      '基础 AI 模型',
      '社区支持',
      '水印输出',
    ],
    cta: '开始使用',
    popular: false,
  },
  {
    name: '专业版',
    price: '¥99',
    period: '/月',
    description: '适合专业用户和中小团队',
    features: [
      '每月 500 次翻译',
      '支持所有文档格式',
      '高级 AI 模型',
      '自定义术语库',
      '优先处理队列',
      '邮件支持',
      '无水印输出',
      'API 访问',
    ],
    cta: '立即订阅',
    popular: true,
  },
  {
    name: '企业版',
    price: '定制',
    period: '价格',
    description: '适合大型企业和组织',
    features: [
      '无限次翻译',
      '支持所有文档格式',
      '专属 AI 模型',
      '专属术语库',
      '最高优先级',
      '专属客户经理',
      '私有化部署',
      'SLA 保障',
      '定制开发',
    ],
    cta: '联系销售',
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-border bg-background px-4 py-24 md:px-6 md:py-32">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl">
            灵活定价 按需选择
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground md:text-lg leading-relaxed">
            从个人到企业，我们为每个需求提供合适的方案
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col bg-card transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-primary shadow-lg hover:shadow-xl hover:bg-card/95'
                  : 'border border-border hover:border-primary/50 hover:shadow-lg hover:bg-card/90 dark:hover:bg-card'
              }`}
            >
              {plan.popular && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white"
                  aria-label="最受欢迎的方案"
                >
                  最受欢迎
                </Badge>
              )}
              
              <CardHeader className="pb-8">
                <CardTitle className="font-heading text-2xl">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="text-sm leading-relaxed text-foreground/90">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full transition-all duration-200 active:scale-95 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white hover:opacity-90 hover:shadow-lg'
                      : 'hover:bg-muted/50 hover:border-primary/50'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  asChild
                >
                  <Link href={plan.name === '企业版' ? '/pricing' : '/signup'}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
