"use client"

import { ChevronDown } from "lucide-react"

interface LanguageSelectorProps {
  sourceLanguage: string
  targetLanguage: string
  onSourceChange: (lang: string) => void
  onTargetChange: (lang: string) => void
}

const languages = [
  { code: "auto", name: "自动检测", flag: "🔍" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "en", name: "英语", flag: "🇺🇸" },
  { code: "ja", name: "日语", flag: "🇯🇵" },
  { code: "ko", name: "韩语", flag: "🇰🇷" },
  { code: "fr", name: "法语", flag: "🇫🇷" },
  { code: "de", name: "德语", flag: "🇩🇪" },
  { code: "es", name: "西班牙语", flag: "🇪🇸" },
  { code: "ru", name: "俄语", flag: "🇷🇺" },
  { code: "ar", name: "阿拉伯语", flag: "🇸🇦" },
]

interface SingleLanguageSelectorProps {
  value: string
  onChange: (lang: string) => void
}

// 快速语言选择器 - 常用语言
export function QuickLanguageSelector({ value, onChange }: SingleLanguageSelectorProps) {
  const quickLanguages = languages.filter(l => l.code !== "auto").slice(0, 6)

  return (
    <div className="flex flex-wrap gap-2">
      {quickLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            value === lang.code
              ? "bg-indigo-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {lang.flag} {lang.name}
        </button>
      ))}
    </div>
  )
}

// 完整语言选择器 - 下拉列表
export function LanguageSelector({ value, onChange }: SingleLanguageSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        {languages.filter(l => l.code !== "auto").map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  )
}

// 双语言选择器（源语言 + 目标语言）
export function DualLanguageSelector({
  sourceLanguage,
  targetLanguage,
  onSourceChange,
  onTargetChange
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">源语言</label>
        <div className="relative">
          <select
            value={sourceLanguage}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center justify-center w-10 h-10 mt-6 bg-gray-100 rounded-full">
        <span className="text-xl">→</span>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">目标语言</label>
        <div className="relative">
          <select
            value={targetLanguage}
            onChange={(e) => onTargetChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {languages.filter(l => l.code !== "auto").map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
