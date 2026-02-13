'use client'

import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  completedSteps: number[]
}

export function StepIndicator({ currentStep, completedSteps }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: '选择文件' },
    { number: 2, label: '配置导入' },
    { number: 3, label: '预览确认' },
    { number: 4, label: '上传完成' },
  ]

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full font-heading font-semibold transition-all duration-300 ${
                  step.number === currentStep
                    ? 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white shadow-lg'
                    : completedSteps.includes(step.number)
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {completedSteps.includes(step.number) ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span className="mt-3 text-sm font-medium text-foreground">{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-1 flex-1 rounded-full transition-colors duration-300 ${
                  completedSteps.includes(step.number)
                    ? 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]'
                    : 'bg-muted'
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
