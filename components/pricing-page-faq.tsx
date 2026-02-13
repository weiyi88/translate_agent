'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: '我可以随时升级或降级方案吗？',
    answer:
      '当然可以。您可以在设置中随时升级、降级或取消订阅。升级立即生效，降级将在下个计费周期生效。',
  },
  {
    question: '免费版有使用期限吗？',
    answer:
      '没有。免费版永久免费，但每月仅提供10页的翻译额度。当您需要更多翻译量时，可随时升级到专业版。',
  },
  {
    question: '如何取消订阅？',
    answer:
      '您可以在账户设置中随时取消订阅。取消后，您的账户将在本计费周期结束时降级为免费版。已支付的费用不予退回。',
  },
  {
    question: '专业版的 API 调用限制是多少？',
    answer:
      '专业版提供每月 100,000 次 API 调用。如果您需要更多调用量，请升级到企业版或与我们联系以获取定制方案。',
  },
  {
    question: '可以申请发票吗？',
    answer:
      '是的。所有订阅用户都可以申请发票。请在账户设置中的"计费"部分申请，我们将在 2-3 个工作日内处理。',
  },
  {
    question: '企业版提供什么支持？',
    answer:
      '企业版包括 24/7 专属客户支持、专属账户经理、99.9% SLA 保障、私有部署选项和定制开发服务。',
  },
  {
    question: '数据安全如何保证？',
    answer:
      '我们使用行业标准的 AES-256 加密保护您的数据。所有翻译记录都存储在安全的云服务器上，并定期进行安全审计。',
  },
  {
    question: '如何开始使用企业版？',
    answer:
      '请点击企业版的"联系我们"按钮，我们的销售团队将与您联系讨论您的具体需求并提供定制报价。',
  },
]

export function PricingPageFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="border-b px-4 py-20 md:px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight">
            常见问题
          </h2>
          <p className="text-lg text-muted-foreground">
            快速了解关于我们定价和服务的常见问题
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="transition-all duration-200 hover:border-primary/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-expanded={openIndex === index}
              >
                <h3 className="font-semibold text-foreground">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {openIndex === index && (
                <CardContent className="border-t px-6 py-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-foreground">
            还有其他问题？
          </p>
          <Button
            variant="outline"
            size="lg"
            className="hover:bg-muted/50 bg-transparent"
          >
            联系我们
          </Button>
        </div>
      </div>
    </section>
  )
}
