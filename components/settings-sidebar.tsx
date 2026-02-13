'use client'

import { User, Lock, Shield, Bell, Palette, Code } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

const menuItems = [
  { id: 'profile', label: '个人资料', labelEn: 'Profile', icon: User, description: '姓名、头像、个人信息', descriptionEn: 'Name, avatar, personal info' },
  { id: 'account', label: '账户管理', labelEn: 'Account', icon: Lock, description: '邮箱、密码、登录设备', descriptionEn: 'Email, password, devices' },
  { id: 'security', label: '安全设置', labelEn: 'Security', icon: Shield, description: '双因素认证、会话管理', descriptionEn: '2FA, session management' },
  { id: 'notifications', label: '通知提醒', labelEn: 'Notifications', icon: Bell, description: '邮件通知、系统提醒', descriptionEn: 'Email, system alerts' },
  { id: 'preferences', label: '系统偏好', labelEn: 'Preferences', icon: Palette, description: '语言、时区、主题', descriptionEn: 'Language, timezone, theme' },
  { id: 'api', label: 'API 密钥', labelEn: 'API Keys', icon: Code, description: '开发者接口密钥', descriptionEn: 'Developer API keys' },
]

export function SettingsSidebar({ activeSection, onSectionChange }: { activeSection: string; onSectionChange: (section: string) => void }) {
  const { language } = useTranslation()
  
  return (
    <aside className="w-72 border-r bg-[#FFFBF8] p-6">
      <nav className="space-y-1" aria-label="Settings navigation">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full rounded-xl px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-stone-700 hover:bg-amber-50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${activeSection === item.id ? 'text-white' : 'text-green-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${activeSection === item.id ? 'text-white' : 'text-stone-800'}`}>
                    {language === 'zh' ? item.label : item.labelEn}
                  </div>
                  <div className={`text-xs mt-0.5 ${activeSection === item.id ? 'text-green-50' : 'text-stone-500'}`}>
                    {language === 'zh' ? item.description : item.descriptionEn}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
