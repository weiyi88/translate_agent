/**
 * Pricing Page
 * 订阅价格页面
 */
import Link from 'next/link';
import { Check, Zap, Shield, HeadphonesIcon, Infinity, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PLANS = [
  {
    name: '免费版',
    description: '适合个人试用',
    price: 0,
    period: '永久免费',
    icon: null,
    features: [
      '每月 10 页翻译额度',
      '基础 AI 模型 (GPT-4o Mini)',
      '支持 PPT/Word/Excel/PDF',
      '社区支持',
      '保存翻译历史 7 天',
    ],
    cta: '免费开始',
    ctaLink: '/signup',
    popular: false,
  },
  {
    name: '专业版',
    description: '适合专业用户和团队',
    price: 99,
    period: '/月',
    icon: Zap,
    features: [
      '无限翻译页数',
      '所有 AI 模型 (GPT-4o, Claude 3.5)',
      '术语库管理',
      '优先处理队列',
      '邮件支持',
      '保存翻译历史 90 天',
      '批量翻译 (最多 50 个文件)',
      'API 访问 (10,000 次/月)',
    ],
    cta: '立即订阅',
    ctaLink: '/checkout?plan=pro',
    popular: true,
  },
  {
    name: '企业版',
    description: '适合大型团队和企业',
    price: null,
    period: '定制价格',
    icon: Shield,
    features: [
      '无限翻译 + 无限 API',
      '私有化部署',
      '定制功能开发',
      '专属客户经理',
      '7x24 技术支持',
      'SLA 保障 99.9%',
      '团队协作 (无限成员)',
      'SSO 单点登录',
      '审计日志',
      '合规认证 (ISO 27001)',
    ],
    cta: '联系我们',
    ctaLink: '/contact',
    popular: false,
  },
];

const COMPARISON = [
  { feature: '翻译页数', free: '10 页/月', pro: '无限', enterprise: '无限' },
  { feature: 'AI 模型', free: 'GPT-4o Mini', pro: '全部模型', enterprise: '全部模型' },
  { feature: '术语库', free: '❌', pro: '✅', enterprise: '✅' },
  { feature: 'API 访问', free: '❌', pro: '10K 次/月', enterprise: '无限' },
  { feature: '支持', free: '社区', pro: '邮件', enterprise: '专属经理' },
  { feature: '部署方式', free: '云端', pro: '云端', enterprise: '私有化' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-bg -z-10" />
        <div className="absolute inset-0 grid-bg -z-10 opacity-50" />

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
            <Infinity className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">灵活定价 按需选择</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            选择适合您的
            <span className="text-gradient">订阅计划</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            从免费开始，随业务增长随时升级。无隐藏费用，随时取消。
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-gray-100 rounded-lg">
            <button className="px-4 py-2 rounded-md bg-white shadow-sm font-medium text-sm">
              月付
            </button>
            <button className="px-4 py-2 rounded-md font-medium text-sm text-gray-600">
              年付 <span className="text-success font-semibold">省 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      最受欢迎
                    </div>
                  </div>
                )}

                <Card
                  className={`p-8 h-full ${
                    plan.popular
                      ? 'border-2 border-primary-500 shadow-xl'
                      : 'border border-gray-200'
                  }`}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    {plan.icon && (
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                        <plan.icon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>

                    <div className="flex items-baseline justify-center gap-1">
                      {plan.price !== null ? (
                        <>
                          <span className="text-4xl font-bold">¥{plan.price}</span>
                          <span className="text-gray-500">{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={plan.ctaLink}>
                    <Button
                      className={`w-full ${
                        plan.popular ? 'btn-primary' : 'variant="outline"'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4">
              详细对比
            </h2>
            <p className="text-gray-600">了解各计划的差异，选择最适合您的方案</p>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold">功能</th>
                  <th className="text-center py-4 px-6 font-semibold">免费版</th>
                  <th className="text-center py-4 px-6 font-semibold text-primary-600">专业版</th>
                  <th className="text-center py-4 px-6 font-semibold">企业版</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="py-4 px-6 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.free}</td>
                    <td className="py-4 px-6 text-center font-medium text-primary-700">{row.pro}</td>
                    <td className="py-4 px-6 text-center font-medium">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4">
              常见问题
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">我可以随时取消订阅吗？</h3>
              <p className="text-gray-600">
                是的，您可以随时取消订阅。取消后，您将在当前计费周期结束时失去访问权限，但已翻译的文档仍可下载。
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">免费版有什么限制？</h3>
              <p className="text-gray-600">
                免费版每月提供 10 页翻译额度，使用基础 AI 模型。适合个人试用和轻度使用。
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">企业版如何定制？</h3>
              <p className="text-gray-600">
                企业版提供私有化部署和定制开发服务。请联系我们的销售团队，我们将根据您的需求提供定制方案和报价。
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">翻译额度如何计算？</h3>
              <p className="text-gray-600">
                我们按"页"计算翻译额度。对于文档，一页指一个标准幻灯片页面或 A4 纸张。对于文本，按字符数换算（约 500 字符 = 1 页）。
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            准备好开始了吗？
          </h2>
          <p className="text-xl opacity-90 mb-8">
            加入数千名用户，使用 AI 翻译提升工作效率
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                免费开始
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <HeadphonesIcon className="w-4 h-4 mr-2" />
                联系销售
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
