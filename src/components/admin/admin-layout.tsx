'use client';

import { ReactNode, useState } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  onLogout: () => void;
}

export function AdminLayout({ children, title, description, onLogout }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - Fixed positioning for consistency */}
      <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4 lg:hidden fixed top-24 left-0 right-0 z-40">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <VisuallyHidden>
              <h2>Admin Navigation Menu</h2>
            </VisuallyHidden>
            <AdminSidebar onLogout={onLogout} />
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-[calc(100vh-6rem)] pt-20">
        {/* Desktop Sidebar */}
        <AdminSidebar onLogout={onLogout} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex h-16 items-center border-b bg-muted/40 px-6">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex-1 p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Content - Always has proper spacing */}
      <div className="lg:hidden pt-40">
        <div className="flex-1 p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
