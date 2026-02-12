/**
 * Dashboard Layout
 * 仪表板布局 - 包含侧边栏导航
 */
import { ReactNode } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
