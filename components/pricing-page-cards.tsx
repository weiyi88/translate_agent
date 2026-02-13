'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

const plans = [
  {
    name: '免费版',
    price: '0',
    period: '月',
    description: '适合个人用户',
    features: [
      { text: '10页/月', included: true },
      { text: 'GPT-4o Mini', included: true },
      { text: '社区支持', included: true },
      { text: '水印输出', included: false },
      { text: '词库', included: false },
      { text: 'API 访问', included: false },
    ],
    cta: '免费开始',
    popular: false,
  },
  {
    name: '专业版',
    price: '99',
    period: '月',
    description: '适合专业用户',
    features: [
      { text: '无限翻译', included: true },
      { text: '全部模型', included: true },
      { text: '词库管理', included: true },
      { text: '优先支持', included: true },
      { text: 'API 访问', included: true },
      { text: '私有部署', included: false },
    ],
    cta: '立即订阅',
    popular: true,
  },
  {
    name: '企业版',
    price: '定制',
    period: '价格',
    description: '适合企业级用户',
    features: [
      { text: '无限翻译', included: true },
      { text: '全部模型', included: true },
      { text: '词库管理', included: true },
      { text: '优先支持', included: true },
      { text: 'API 访问', included: true },
      { text: '私有部署', included: true },
    ],
    cta: '联系我们',
    popular: false,
  },
]

export function PricingPageCards() {
  return (
    <section className="border-b px-4 py-20 md:px-6">
      <div className="container mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-primary shadow-lg hover:shadow-xl'
                  : 'border hover:border-primary/50 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white"
                  aria-label="推荐方案"
                >
                  推荐
                </Badge>
              )}

              <CardHeader className="pb-6">
                <CardTitle className="font-heading text-2xl">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-heading text-5xl font-bold tracking-tight">
                    {plan.price === '定制' ? plan.price : `¥${plan.price}`}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      <div className={`mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center ${
                        feature.included ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        {feature.included && (
                          <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        )}
                      </div>
                      <span className={`text-sm leading-relaxed ${
                        feature.included ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {feature.text}
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
                  <Link href="/signup">
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
