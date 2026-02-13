'use client'

import { useState, useEffect } from 'react'
import { GlossaryUploadHeader } from '@/components/glossary-upload-header'
import { StepIndicator } from '@/components/glossary-upload-step-indicator'
import { FileUploadZone } from '@/components/glossary-upload-file-selector'
import { ConfigForm, type ConfigData } from '@/components/glossary-upload-config'
import { PreviewTable } from '@/components/glossary-upload-preview'
import { UploadProgress } from '@/components/glossary-upload-progress'
import { UploadCompletion } from '@/components/glossary-upload-completion'
import { Button } from '@/components/ui/button'

interface PreviewTerm {
  id: string
  source: string
  target: string
  status: 'success' | 'warning' | 'error'
  error?: string
}

const mockTerms: PreviewTerm[] = [
  { id: '1', source: 'AI', target: 'Artificial Intelligence', status: 'success' },
  { id: '2', source: 'ML', target: 'Machine Learning', status: 'success' },
  { id: '3', source: '深度学习', target: 'Deep Learning', status: 'warning', error: '格式错误' },
  { id: '4', source: '神经网络', target: 'Neural Network', status: 'success' },
  { id: '5', source: '数据科学', target: 'Data Science', status: 'success' },
  { id: '6', source: 'NLP', target: 'Natural Language Processing', status: 'success' },
  { id: '7', source: '计算机视觉', target: 'Computer Vision', status: 'success' },
  { id: '8', source: '强化学习', target: 'Reinforcement Learning', status: 'success' },
  { id: '9', source: 'GPU', target: 'Graphics Processing Unit', status: 'success' },
  { id: '10', source: '张量', target: 'Tensor', status: 'success' },
]

export default function GlossaryUploadPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [config, setConfig] = useState<ConfigData | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Simulate file loading
  useEffect(() => {
    if (selectedFile && !isLoadingFile) {
      setIsLoadingFile(true)
      const timer = setTimeout(() => {
        setIsLoadingFile(false)
        setCurrentStep(2)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [selectedFile])

  // Simulate upload progress
  useEffect(() => {
    if (currentStep === 3 && uploadProgress === 0) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setCompletedSteps([1, 2, 3, 4])
              setCurrentStep(4)
            }, 500)
            return 100
          }
          return prev + Math.random() * 30
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [currentStep, uploadProgress])

  const handleFileSelect = (file: File | null) => {
    if (file === null) {
      setSelectedFile(null)
      setCurrentStep(1)
      setCompletedSteps([])
    } else {
      setSelectedFile(file)
    }
  }

  const handleConfigChange = (newConfig: ConfigData) => {
    setConfig(newConfig)
  }

  const handleNext = () => {
    if (currentStep === 2 && config) {
      setCompletedSteps([...completedSteps, 2])
      setCurrentStep(3)
      setUploadProgress(0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setCompletedSteps(completedSteps.filter((step) => step !== currentStep - 1))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlossaryUploadHeader />

      <main className="flex-1 px-4 py-12 md:px-6">
        <div className="mx-auto max-w-4xl">
          <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

          {/* Step 1: Select File */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <FileUploadZone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile || undefined}
                isLoading={isLoadingFile}
              />
              {selectedFile && !isLoadingFile && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      setCompletedSteps([...completedSteps, 1])
                      setCurrentStep(2)
                    }}
                    className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] px-8 text-white hover:opacity-90 transition-opacity duration-200"
                  >
                    下一步
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Configure */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <ConfigForm onConfigChange={handleConfigChange} />
              <div className="flex justify-between">
                <Button onClick={handlePrevious} variant="outline" className="border-2 bg-transparent">
                  上一步
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!config}
                  className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] px-8 text-white hover:opacity-90 transition-opacity duration-200"
                >
                  下一步
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 3 && uploadProgress === 0 && (
            <div className="space-y-6">
              <PreviewTable terms={mockTerms} totalCount={156} warningCount={1} />
              <div className="flex justify-between">
                <Button onClick={handlePrevious} variant="outline" className="border-2 bg-transparent">
                  上一步
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] px-8 text-white hover:opacity-90 transition-opacity duration-200"
                >
                  开始上传
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Uploading */}
          {currentStep === 3 && uploadProgress > 0 && uploadProgress < 100 && (
            <UploadProgress
              successCount={Math.floor((uploadProgress / 100) * 141)}
              skipCount={Math.floor((uploadProgress / 100) * 12)}
              errorCount={Math.floor((uploadProgress / 100) * 3)}
              totalCount={156}
              currentProgress={Math.floor(uploadProgress)}
            />
          )}

          {/* Step 4: Completion */}
          {currentStep === 4 && <UploadCompletion successCount={141} skipCount={12} errorCount={3} />}
        </div>
      </main>
    </div>
  )
}
