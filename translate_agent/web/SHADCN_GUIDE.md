# 🧩 Shadcn/ui 组件使用指南

> **版本**: v1.0
> **更新日期**: 2026-02-04
> **基于**: UI/UX Pro Max Shadcn Stack Guidelines

---

## 📋 目录

- [核心原则](#核心原则)
- [表单组件](#表单组件)
- [对话框组件](#对话框组件)
- [命令面板](#命令面板)
- [可访问性](#可访问性)
- [性能优化](#性能优化)
- [常见模式](#常见模式)

---

## 🎯 核心原则

### 1. 使用 Zod 进行表单验证

**✅ 正确**:
```tsx
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  email: z.string().email({ message: '无效的邮箱地址' }),
  password: z.string().min(8, { message: '密码至少 8 个字符' }),
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
})
```

**❌ 错误**:
```tsx
// 手动验证逻辑
const validate = (values: FormValues) => {
  if (!values.email) {
    return { email: '邮箱不能为空' }
  }
}
```

### 2. Form + React Hook Form 集成

**✅ 正确**:
```tsx
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const form = useForm()

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>邮箱</FormLabel>
        <FormControl>
          <Input placeholder="email@example.com" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

**❌ 错误**:
```tsx
// 不使用 Form 组件
<form onSubmit={handleSubmit}>
  <input onChange={e => setEmail(e.target.value)} />
</form>
```

---

## 📝 表单组件

### 基础表单结构

```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>标签</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription>可选描述</FormDescription>
      <FormMessage /> {/* 错误消息 */}
    </FormItem>
  )}
/>
```

### 表单验证错误显示

**✅ 使用 FormMessage**:
```tsx
<FormControl>
  <Input {...field} />
</FormControl>
<FormMessage />
```

**❌ 自定义错误文本**:
```tsx
<Input {...field} />
{error && <span>{error}</span>}
```

### 输入框必须有标签

**✅ 正确**:
```tsx
<FormLabel htmlFor="email">邮箱</FormLabel>
<FormControl>
  <Input id="email" {...field} />
</FormControl>
```

**❌ 错误**:
```tsx
<FormControl>
  <Input placeholder="邮箱" /> {/* 仅有 placeholder */}
</FormControl>
```

---

## 💬 对话框组件

### Dialog 使用场景

**用于**: 模态内容、确认、表单、详情

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>标题</DialogTitle>
      <DialogDescription>描述</DialogDescription>
    </DialogHeader>
    <div>内容</div>
  </DialogContent>
</Dialog>
```

### 对话框状态管理

**✅ 受控状态**:
```tsx
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>打开</Button>
  </DialogTrigger>
</Dialog>
```

**❌ 非受控**:
```tsx
<Dialog defaultOpen={true}> {/* 不推荐 */}
```

### 对话框语义结构

**✅ 完整结构**:
```tsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>标题</DialogTitle>
    <DialogDescription>描述</DialogDescription>
  </DialogHeader>
  {/* 内容 */}
</DialogContent>
```

**❌ 缺失结构**:
```tsx
<DialogContent>
  <p>内容</p> {/* 缺少标题和描述 */}
</DialogContent>
```

### AlertDialog 用于确认

**用于**: 删除、危险操作确认

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">删除</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>确认删除？</AlertDialogTitle>
      <AlertDialogDescription>
        此操作无法撤销
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive">确认</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**❌ 使用 Dialog 进行确认**:
```tsx
// 不要用普通 Dialog 处理危险操作确认
<Dialog>...</Dialog>
```

### Sheet 用于侧边面板

**用于**: 导航、过滤器、设置侧边栏

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger asChild>
    <Button>打开设置</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>设置</SheetTitle>
    </SheetHeader>
    {/* 内容 */}
  </SheetContent>
</Sheet>
```

**❌ 用 Dialog 模拟侧边栏**:
```tsx
// 不要用 Dialog + 滑动动画
<Dialog>...</Dialog>
```

---

## 🔍 命令面板

### Command 用于搜索

**用于**: 可搜索列表、命令面板

```tsx
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

<Command>
  <CommandInput placeholder="搜索..." />
  <CommandList>
    <CommandEmpty>未找到结果</CommandEmpty>
    <CommandGroup heading="选项">
      <CommandItem>选项 1</CommandItem>
      <CommandItem>选项 2</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**❌ 自定义下拉搜索**:
```tsx
// 不要用 Input + 自定义下拉
<Input />
<div className="dropdown">...</div>
```

---

## ♿ 可访问性

### 焦点管理

**Dialog 和 Sheet 自动管理焦点**:
```tsx
<Dialog>
  {/* 组件会自动捕获焦点 */}
  <DialogContent>
    <Button onClick={() => closeDialog()}>关闭</Button>
  </DialogContent>
</Dialog>
```

**❌ 自定义焦点处理**:
```tsx
// 不要手动处理焦点
useEffect(() => {
  document.querySelector('.dialog')?.focus()
}, [])
```

### ARIA 标签

**使用 FormLabel**:
```tsx
<FormLabel>邮箱</FormLabel>
<FormControl>
  <Input {...field} />
</FormControl>
```

**❌ Placeholder 作为唯一标签**:
```tsx
<FormControl>
  <Input placeholder="邮箱" />
</FormControl>
```

### 仅图标按钮需要 aria-label

```tsx
<button aria-label="关闭菜单">
  <XIcon />
</button>
```

---

## ⚡ 性能优化

### 懒加载对话框内容

**✅ 动态导入**:
```tsx
const HeavyDialog = lazy(() => import('./HeavyDialog'))

<Suspense fallback={<Skeleton />}>
  <HeavyDialog />
</Suspense>
```

**❌ 预先导入所有对话框**:
```tsx
import HeavyDialog from './HeavyDialog'
import AnotherDialog from './AnotherDialog'
```

### 动态导入 Shadcn 组件

```tsx
// 只在需要时导入
const Dialog = dynamic(() =>
  import('@/components/ui/dialog').then(mod => ({ default: mod.Dialog }))
)
```

---

## 🎨 常见模式

### 1. 表单 + 对话框

```tsx
function CreateDialog() {
  const [open, setOpen] = useState(false)
  const form = useForm()

  const onSubmit = (values: FormValues) => {
    // 提交逻辑
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>创建</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建新项目</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>项目名称</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">提交</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### 2. 确认删除

```tsx
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">删除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作无法撤销
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### 3. 搜索选择器

```tsx
function LanguageSelector() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {selectedLanguage || '选择语言'}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="搜索语言..." />
          <CommandList>
            <CommandEmpty>未找到</CommandEmpty>
            <CommandGroup>
              {languages.map(lang => (
                <CommandItem
                  key={lang.code}
                  onSelect={() => {
                    setSelectedLanguage(lang.name)
                    setOpen(false)
                  }}
                >
                  {lang.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

### 4. 侧边栏设置

```tsx
function SettingsSheet() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <SettingsIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>设置</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          {/* 设置表单 */}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

---

## 📏 组件尺寸规范

### Button 尺寸

```tsx
<Button size="sm">小按钮</Button>
<Button size="default">默认按钮</Button>
<Button size="lg">大按钮</Button>
<Button size="icon">图标按钮</Button>
```

### Input 尺寸

```tsx
<Input className="h-9" />  {/* 小 */}
<Input className="h-10" /> {/* 默认 */}
<Input className="h-11" /> {/* 大 */}
```

### Dialog 宽度

```tsx
<DialogContent className="sm:max-w-md">  {/* 小 */}
<DialogContent className="sm:max-w-lg">  {/* 中 */}
<DialogContent className="sm:max-w-xl">  {/* 大 */}
<DialogContent className="sm:max-w-2xl"> {/* 超大 */}
```

---

## 🎯 最佳实践总结

### ✅ 做

1. **使用 Zod 定义表单 Schema**
2. **Form + React Hook Form 集成**
3. **FormField 包装所有输入**
4. **FormMessage 显示验证错误**
5. **FormLabel 标注所有表单字段**
6. **Dialog 用于模态内容**
7. **AlertDialog 用于危险操作确认**
8. **Sheet 用于侧边面板**
9. **Command 用于搜索和命令面板**
10. **Dialog 受控状态管理**
11. **完整的对话框语义结构**
12. **懒加载重型对话框内容**

### ❌ 不做

1. **手动验证逻辑**（使用 Zod）
2. **自定义表单状态管理**（使用 React Hook Form）
3. **Placeholder 作为唯一标签**（使用 FormLabel）
4. **自定义错误消息显示**（使用 FormMessage）
5. **Dialog 用于确认**（使用 AlertDialog）
6. **Dialog 用于侧边栏**（使用 Sheet）
7. **自定义搜索下拉**（使用 Command）
8. **非受控对话框**（使用 open/onOpenChange）
9. **缺少对话框标题或描述**
10. **预先导入所有对话框**（懒加载）

---

## 📚 参考资料

- **Shadcn/ui 官方文档**: https://ui.shadcn.com
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

---

**文档版本**: v1.0
**最后更新**: 2026-02-04
**维护者**: Claude (UI/UX Pro Max)
