"use client"

import { Check } from "lucide-react"

interface TranslationProgressProps {
  status: "idle" | "uploading" | "translating" | "completed" | "error"
  progress: number
  currentFile?: string
  totalFiles?: number
  currentFileIndex?: number
  errorMessage?: string
}

export function TranslationProgress({
  status,
  progress,
  currentFile,
  totalFiles = 1,
  currentFileIndex = 1,
  errorMessage
}: TranslationProgressProps) {
  const getStatusText = () => {
    switch (status) {
      case "idle": return "准备就绪"
      case "uploading": return "上传中..."
      case "translating": return `翻译中 (${currentFileIndex}/${totalFiles})`
      case "completed": return "翻译完成"
      case "error": return "翻译失败"
      default: return ""
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "completed": return "text-green-600"
      case "error": return "text-red-600"
      default: return "text-indigo-600"
    }
  }

  if (status === "idle") return null

  return (
    <div className="w-full space-y-3 p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            status === "completed" ? "bg-green-500" :
            status === "error" ? "bg-red-500" :
            "bg-gradient-to-r from-indigo-500 to-violet-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {currentFile && status === "translating" && (
        <p className="text-xs text-gray-500 truncate">正在处理: {currentFile}</p>
      )}

      {status === "completed" && (
        <div className="flex items-center gap-2 text-green-600">
          <Check className="w-4 h-4" />
          <span className="text-sm">所有文件翻译完成</span>
        </div>
      )}

      {status === "error" && errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
