"use client"

import { useState, useCallback, useEffect } from "react"
import { Upload, FileText, FileSpreadsheet, Presentation, FileType, X } from "lucide-react"

interface FileUploaderProps {
  accept?: string
  maxSize?: number
  multiple?: boolean
  onFilesChange: (files: File[]) => void
}

export function FileUploader({
  accept = ".pptx,.docx,.xlsx,.pdf",
  maxSize = 100,
  multiple = true,
  onFilesChange
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const acceptedTypes = accept.split(",").map(t => t.trim())
  const maxFiles = multiple ? 10 : 1

  // 同步 selectedFiles 变化到父组件
  useEffect(() => {
    onFilesChange(selectedFiles)
  }, [selectedFiles, onFilesChange])

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch(ext) {
      case "pptx": return <Presentation className="w-5 h-5 text-orange-500" />
      case "docx": return <FileText className="w-5 h-5 text-blue-500" />
      case "xlsx": return <FileSpreadsheet className="w-5 h-5 text-green-500" />
      case "pdf": return <FileType className="w-5 h-5 text-red-500" />
      default: return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const validateFile = (file: File): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    if (!acceptedTypes.includes(ext)) return false
    if (file.size > maxSize * 1024 * 1024) return false
    return true
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(validateFile).slice(0, maxFiles)

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, maxFiles))
    }
  }, [acceptedTypes, maxFiles, maxSize])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(validateFile).slice(0, maxFiles)
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, maxFiles))
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="w-full space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 bg-white"
        }`}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              拖拽文件到这里，或<span className="text-indigo-600 ml-1">点击选择</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              支持 PPT, Word, Excel, PDF 格式，最大 {maxSize}MB
            </p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              已选择 {selectedFiles.length} 个文件
            </p>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              全部清除
            </button>
          </div>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
