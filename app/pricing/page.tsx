'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/app-layout'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type BillingPeriod = 'monthly' | 'annual'

interface PlanFeature {
  nameZh: string
  nameEn: string
  free: string | boolean
  pro: string | boolean
  ultra: string | boolean
  enterprise: string | boolean
  tooltip?: { zh: string; en: string }
}

const plans = [
  {
    id: 'free',
    nameZh: '免费版',
    nameEn: 'Free',
    icon: Sparkles,
    priceMonthly: 0,
    priceAnnual: 0,
    descZh: '适合个人用户体验',
    descEn: 'Perfect for trying out',
    popular: false,
    ctaZh: '免费开始',
    ctaEn: 'Get Started Free',
    color: 'from-slate-500 to-slate-600',
  },
  {
    id: 'pro',
    nameZh: '专业版',
    nameEn: 'Pro',
    icon: Zap,
    priceMonthly: 99,
    priceAnnual: 79,
    descZh: '适合专业用户和小团队',
    descEn: 'For professionals & small teams',
    popular: true,
    ctaZh: '立即订阅',
    ctaEn: 'Subscribe Now',
    color: 'from-primary to-emerald-500',
  },
  {
    id: 'ultra',
    nameZh: '旗舰版',
    nameEn: 'Ultra',
    icon: Crown,
    priceMonthly: 299,
    priceAnnual: 239,
    descZh: '适合高频使用的团队',
    descEn: 'For power users & teams',
    popular: false,
    ctaZh: '立即订阅',
    ctaEn: 'Subscribe Now',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'enterprise',
    nameZh: '企业版',
    nameEn: 'Enterprise',
    icon: Building2,
    priceMonthly: null,
    priceAnnual: null,
    descZh: '适合大型企业定制需求',
    descEn: 'Custom solutions for enterprises',
    popular: false,
    ctaZh: '联系销售',
    ctaEn: 'Contact Sales',
    color: 'from-violet-500 to-purple-600',
  },
]

const features: PlanFeature[] = [
  {
    nameZh: '每月翻译次数',
    nameEn: 'Translations/Month',
    free: '10',
    pro: '500',
    ultra: '2,000',
    enterprise: '无限',
    tooltip: { zh: '每月可进行的文档翻译次数', en: 'Number of document translations per month' },
  },
  {
    nameZh: '单次最大字符数',
    nameEn: 'Max Characters/Translation',
    free: '5,000',
    pro: '50,000',
    ultra: '200,000',
    enterprise: '无限',
    tooltip: { zh: '单个文档最大支持的字符数', en: 'Maximum characters per document' },
  },
  {
    nameZh: '最大文件大小',
    nameEn: 'Max File Size',
    free: '5 MB',
    pro: '50 MB',
    ultra: '200 MB',
    enterprise: '无限',
  },
  {
    nameZh: '支持格式',
    nameEn: 'Supported Formats',
    free: 'PDF, DOCX',
    pro: '全部格式',
    ultra: '全部格式',
    enterprise: '全部格式 + 自定义',
  },
  {
    nameZh: 'AI 模型',
    nameEn: 'AI Models',
    free: 'GPT-4o Mini',
    pro: '全部模型',
    ultra: '全部模型 + 优先',
    enterprise: '全部 + 私有部署',
  },
  {
    nameZh: '术语库数量',
    nameEn: 'Glossary Limit',
    free: '1',
    pro: '10',
    ultra: '50',
    enterprise: '无限',
  },
  {
    nameZh: '每库术语数',
    nameEn: 'Terms/Glossary',
    free: '100',
    pro: '1,000',
    ultra: '5,000',
    enterprise: '无限',
  },
  {
    nameZh: 'API 访问',
    nameEn: 'API Access',
    free: false,
    pro: true,
    ultra: true,
    enterprise: true,
    tooltip: { zh: '通过 API 集成到您的工作流', en: 'Integrate via API into your workflows' },
  },
  {
    nameZh: '优先队列',
    nameEn: 'Priority Queue',
    free: false,
    pro: false,
    ultra: true,
    enterprise: true,
    tooltip: { zh: '翻译任务优先处理，减少等待时间', en: 'Priority processing for faster results' },
  },
  {
    nameZh: '专属客服支持',
    nameEn: 'Priority Support',
    free: false,
    pro: '工作日',
    ultra: '7x24',
    enterprise: '专属客户经理',
  },
  {
    nameZh: '定制模型训练',
    nameEn: 'Custom Model Training',
    free: false,
    pro: false,
    ultra: false,
    enterprise: true,
    tooltip: { zh: '根据您的数据训练专属翻译模型', en: 'Train custom models on your data' },
  },
  {
    nameZh: 'SLA 保障',
    nameEn: 'SLA Guarantee',
    free: false,
    pro: false,
    ultra: '99.5%',
    enterprise: '99.9%',
    tooltip: { zh: '服务可用性保障', en: 'Service availability guarantee' },
  },
]

export default function PricingPage() {
  const { t, language } = useTranslation()
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annual')

  const formatPrice = (price: number | null) => {
    if (price === null) return language === 'zh' ? '定制' : 'Custom'
    if (price === 0) return language === 'zh' ? '免费' : 'Free'
    return `¥${price}`
  }

  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-primary mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
      )
    }
    if (value === '无限' || value === 'Unlimited') {
      return <span className="text-primary font-medium">{language === 'zh' ? '无限' : 'Unlimited'}</span>
    }
    return <span>{value}</span>
  }

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen overflow-auto">
          {/* Hero Section */}
          <div className="px-6 py-12 border-b border-border bg-gradient-to-b from-muted/30 to-background">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {t.pricing.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                {t.pricing.subtitle}
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted/50 border">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                    billingPeriod === 'monthly'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t.pricing.monthly}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('annual')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 relative',
                    billingPeriod === 'annual'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t.pricing.annual}
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] px-1.5">
                    {t.pricing.annualSave}
                  </Badge>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="px-6 py-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {plans.map((plan) => {
                  const Icon = plan.icon
                  const price = billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceAnnual
                  
                  return (
                    <Card
                      key={plan.id}
                      className={cn(
                        'relative overflow-hidden transition-all duration-200 hover:shadow-lg',
                        plan.popular && 'ring-2 ring-primary shadow-lg'
                      )}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                            {t.pricing.mostPopular}
                          </div>
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <div className={cn(
                          'inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white mb-3',
                          plan.color
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">
                          {language === 'zh' ? plan.nameZh : plan.nameEn}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {language === 'zh' ? plan.descZh : plan.descEn}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-5">
                          <span className="text-3xl font-bold text-foreground">
                            {formatPrice(price)}
                          </span>
                          {price !== null && price > 0 && (
                            <span className="text-muted-foreground text-sm ml-1">
                              {t.pricing.perMonth}
                            </span>
                          )}
                        </div>
                        <Button
                          className={cn(
                            'w-full transition-all duration-200 active:scale-[0.98]',
                            plan.popular
                              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
                              : 'bg-muted hover:bg-muted/80 text-foreground'
                          )}
                          asChild
                        >
                          <Link href={plan.id === 'enterprise' ? '#contact' : '/signup'}>
                            {language === 'zh' ? plan.ctaZh : plan.ctaEn}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="px-6 py-10 bg-muted/20 border-t border-border">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-semibold text-foreground text-center mb-8">
                {t.pricing.featureComparison}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground w-1/4">
                        {language === 'zh' ? '功能' : 'Feature'}
                      </th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="text-center py-4 px-4 font-medium w-[18.75%]">
                          <span className={cn(
                            'inline-block px-3 py-1 rounded-full text-sm',
                            plan.popular
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-foreground'
                          )}>
                            {language === 'zh' ? plan.nameZh : plan.nameEn}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr
                        key={index}
                        className={cn(
                          'border-b border-border transition-colors',
                          index % 2 === 0 ? 'bg-card/50' : 'bg-transparent'
                        )}
                      >
                        <td className="py-4 px-4 text-sm text-foreground">
                          <div className="flex items-center gap-2">
                            <span>{language === 'zh' ? feature.nameZh : feature.nameEn}</span>
                            {feature.tooltip && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground/60" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs bg-card text-card-foreground border shadow-lg">
                                  {language === 'zh' ? feature.tooltip.zh : feature.tooltip.en}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-sm">
                          {renderFeatureValue(feature.free)}
                        </td>
                        <td className="py-4 px-4 text-center text-sm bg-primary/[0.02]">
                          {renderFeatureValue(feature.pro)}
                        </td>
                        <td className="py-4 px-4 text-center text-sm">
                          {renderFeatureValue(feature.ultra)}
                        </td>
                        <td className="py-4 px-4 text-center text-sm">
                          {renderFeatureValue(feature.enterprise)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="px-6 py-10 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold text-foreground text-center mb-8">
                {language === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {[
                  {
                    qZh: '可以随时升级或降级吗？',
                    qEn: 'Can I upgrade or downgrade anytime?',
                    aZh: '是的，您可以随时在账户设置中更改您的订阅计划。升级立即生效，降级将在当前计费周期结束后生效。',
                    aEn: 'Yes, you can change your plan anytime from account settings. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle.',
                  },
                  {
                    qZh: '支持哪些支付方式？',
                    qEn: 'What payment methods are supported?',
                    aZh: '我们支持支付宝、微信支付、信用卡（Visa、Mastercard）以及企业对公转账。',
                    aEn: 'We support Alipay, WeChat Pay, credit cards (Visa, Mastercard), and corporate bank transfers.',
                  },
                  {
                    qZh: '企业版有什么特别优势？',
                    qEn: 'What are the benefits of Enterprise plan?',
                    aZh: '企业版提供私有化部署、专属客户经理、定制模型训练、SLA 保障以及灵活的合同条款。',
                    aEn: 'Enterprise includes private deployment, dedicated account manager, custom model training, SLA guarantee, and flexible contract terms.',
                  },
                ].map((faq, index) => (
                  <Card key={index} className="bg-card">
                    <CardContent className="p-5">
                      <h3 className="font-medium text-foreground mb-2">
                        {language === 'zh' ? faq.qZh : faq.qEn}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language === 'zh' ? faq.aZh : faq.aEn}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="px-6 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-t border-border">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {language === 'zh' ? '准备好开始了吗？' : 'Ready to get started?'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === 'zh'
                  ? '立即注册，免费体验专业的 AI 翻译服务'
                  : 'Sign up now and try professional AI translation for free'}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                  asChild
                >
                  <Link href="/signup">
                    {language === 'zh' ? '免费注册' : 'Sign Up Free'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent"
                  asChild
                >
                  <Link href="/dashboard">
                    {language === 'zh' ? '查看演示' : 'View Demo'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </AppLayout>
  )
}
