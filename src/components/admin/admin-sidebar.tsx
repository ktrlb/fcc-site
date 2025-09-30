'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Upload, 
  Settings,
  LogOut,
  Star,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Staff',
      href: '/admin/staff',
      icon: Users,
    },
    {
      name: 'Ministries',
      href: '/admin/ministries',
      icon: Users,
    },
    {
      name: 'Sermon Series & Sundays',
      href: '/admin/sermon-series',
      icon: FileText,
    },
    {
      name: 'Seasonal Guides',
      href: '/admin/seasonal-guides',
      icon: FileText,
    },
    {
      name: 'Calendar Admin',
      href: '/admin/calendar',
      icon: Calendar,
    },
    {
      name: 'Special Events List',
      href: '/admin/special-events-list',
      icon: Star,
    },
    {
      name: 'All Assets',
      href: '/admin/assets',
      icon: Upload,
    },
    {
      name: 'People (Beta)',
      href: '/admin/people',
      icon: Users,
      isBeta: true,
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-64 border-r bg-muted/40 flex-shrink-0">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/admin">
              <Image
                src="/images/Basic FCC Logo Assets-Transparent.png"
                alt="First Christian Church Granbury"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="sr-only">FCC Admin</span>
              <span>FCC Admin</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{item.name}</span>
                    {item.isBeta && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full font-medium">
                        BETA
                      </span>
                    )}
                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link className="flex items-center gap-2 font-semibold" href="/admin">
                <Image
                  src="/images/Basic FCC Logo Assets-Transparent.png"
                  alt="First Christian Church Granbury"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="sr-only">FCC Admin</span>
                <span>FCC Admin</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        isActive && "bg-muted text-primary"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      {item.isBeta && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full font-medium">
                          BETA
                        </span>
                      )}
                      {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Button
                variant="outline"
                onClick={onLogout}
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
