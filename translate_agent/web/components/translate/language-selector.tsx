/**
 * Language Selector Component
 * 语言选择器组件
 */
'use client';

import { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
];

interface LanguageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  exclude?: string[];
}

export function LanguageSelector({
  value,
  onChange,
  placeholder = '选择语言',
  exclude = [],
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedLanguage = LANGUAGES.find((lang) => lang.code === value);

  const filteredLanguages = LANGUAGES.filter((lang) => {
    if (exclude.includes(lang.code)) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        lang.name.toLowerCase().includes(searchLower) ||
        lang.native.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLanguage ? (
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span>{selectedLanguage.native}</span>
              <span className="text-gray-400 text-sm">({selectedLanguage.name})</span>
            </span>
          ) : (
            <span className="flex items-center gap-2 text-gray-400">
              <Globe className="w-4 h-4" />
              {placeholder}
            </span>
          )}
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="搜索语言..."
            value={search}
            onValueChange={setSearch}
            className="border-0 focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>未找到语言</CommandEmpty>
            <CommandGroup>
              {filteredLanguages.map((lang) => (
                <CommandItem
                  key={lang.code}
                  value={lang.code}
                  onSelect={() => {
                    onChange?.(lang.code);
                    setOpen(false);
                    setSearch('');
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={`w-4 h-4 mr-2 ${
                      value === lang.code ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <span className="flex-1">{lang.native}</span>
                  <span className="text-sm text-gray-400">{lang.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Quick Language Selector (Button Grid)
export function QuickLanguageSelector({
  value,
  onChange,
  exclude = [],
}: Omit<LanguageSelectorProps, 'placeholder'>) {
  const quickLanguages = LANGUAGES.filter((lang) => !exclude.includes(lang.code)).slice(0, 8);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {quickLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange?.(lang.code)}
          className={`
            px-4 py-3 rounded-lg border-2 transition-all duration-200
            font-medium text-sm
            ${
              value === lang.code
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          {lang.native}
        </button>
      ))}
    </div>
  );
}
