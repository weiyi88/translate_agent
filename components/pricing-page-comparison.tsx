import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

const features = [
  {
    category: '基础功能',
    items: [
      { name: '文件翻译', free: true, pro: true, enterprise: true },
      { name: '对话翻译', free: false, pro: true, enterprise: true },
      { name: '支持格式', free: '4种', pro: '全部', enterprise: '全部' },
      { name: '单次文件大小', free: '10MB', pro: '100MB', enterprise: '无限' },
    ],
  },
  {
    category: '翻译模型',
    items: [
      { name: 'GPT-4o Mini', free: true, pro: true, enterprise: true },
      { name: 'GPT-4o', free: false, pro: true, enterprise: true },
      { name: 'Claude 3.5', free: false, pro: true, enterprise: true },
      { name: '自定义模型', free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: '术语库与词库',
    items: [
      { name: '词库管理', free: false, pro: true, enterprise: true },
      { name: '词库数量', free: '0', pro: '5', enterprise: '无限' },
      { name: '导入/导出', free: false, pro: true, enterprise: true },
      { name: '自动应用词库', free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: '支持与服务',
    items: [
      { name: '技术支持', free: '社区', pro: '优先', enterprise: '24/7' },
      { name: '邮件支持', free: false, pro: true, enterprise: true },
      { name: '专属账户经理', free: false, pro: false, enterprise: true },
      { name: 'SLA 保障', free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: '开发者功能',
    items: [
      { name: 'REST API', free: false, pro: true, enterprise: true },
      { name: 'API 调用限制', free: '-', pro: '100K/月', enterprise: '无限' },
      { name: 'Webhook 支持', free: false, pro: true, enterprise: true },
      { name: '自定义集成', free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: '企业功能',
    items: [
      { name: '私有部署', free: false, pro: false, enterprise: true },
      { name: '数据加密', free: false, pro: true, enterprise: true },
      { name: '合规认证', free: false, pro: false, enterprise: true },
      { name: '自定义开发', free: false, pro: false, enterprise: true },
    ],
  },
]

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-5 w-5 text-primary" aria-hidden="true" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/50" aria-hidden="true" />
    )
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>
}

export function PricingPageComparison() {
  return (
    <section className="border-b px-4 py-20 md:px-6">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight">
            功能对比
          </h2>
          <p className="text-lg text-muted-foreground">
            详细查看各方案的功能差异
          </p>
        </div>

        <div className="space-y-8">
          {features.map((feature) => (
            <Card key={feature.category} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="font-heading text-lg">
                  {feature.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          功能
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                          免费版
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                          专业版
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                          企业版
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feature.items.map((item, index) => (
                        <tr
                          key={item.name}
                          className={`border-b transition-colors duration-200 hover:bg-muted/30 ${
                            index % 2 === 0 ? 'bg-background' : 'bg-muted/5'
                          }`}
                        >
                          <td className="px-6 py-4 text-sm text-foreground">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <FeatureValue value={item.free} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <FeatureValue value={item.pro} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <FeatureValue value={item.enterprise} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
