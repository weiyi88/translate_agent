'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: '一', value: 30 },
  { day: '二', value: 45 },
  { day: '三', value: 60 },
  { day: '四', value: 55 },
  { day: '五', value: 75 },
  { day: '六', value: 80 },
  { day: '日', value: 85 },
]

export function UsageChart() {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle>使用量趋势</CardTitle>
        <CardDescription>本周的翻译页数统计</CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="day"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'var(--color-foreground)' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="rgb(var(--primary))"
              strokeWidth={2}
              dot={{
                fill: 'rgb(var(--primary))',
                r: 4,
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
          <div>
            <p className="text-sm text-muted-foreground">本月</p>
            <p className="text-2xl font-bold">85页</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">上月</p>
            <p className="text-2xl font-bold">62页</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
