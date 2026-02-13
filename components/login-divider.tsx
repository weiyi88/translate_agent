export function LoginDivider() {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-background px-3 text-muted-foreground font-medium">
          或
        </span>
      </div>
    </div>
  )
}
