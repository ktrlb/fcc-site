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
  Star
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      description: 'Overview and main dashboard'
    },
    {
      name: 'Assets',
      href: '/admin/assets',
      icon: Upload,
      description: 'Manage files and media'
    },
    {
      name: 'Staff',
      href: '/admin/staff',
      icon: Users,
      description: 'Manage staff members'
    },
    {
      name: 'Ministries',
      href: '/admin/ministries',
      icon: Users,
      description: 'Manage ministry teams'
    },
    {
      name: 'Sermon Series',
      href: '/admin/sermon-series',
      icon: FileText,
      description: 'Manage sermon series'
    },
    {
      name: 'Seasonal Guides',
      href: '/admin/seasonal-guides',
      icon: FileText,
      description: 'Manage seasonal guides'
    },
        {
          name: 'Calendar Admin',
          href: '/admin/calendar',
          icon: Calendar,
          description: 'Manage calendar events'
        },
        {
          name: 'Special Events',
          href: '/admin/special-events',
          icon: Settings,
          description: 'Manage special event types'
        },
        {
          name: 'Special Events List',
          href: '/admin/special-events-list',
          icon: Star,
          description: 'View and manage special events'
        }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/Basic FCC Logo Assets-Transparent.png"
            alt="First Christian Church Granbury"
            width={1080}
            height={1080}
            className="h-6 w-6 object-contain"
          />
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            >
              <Icon className="h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
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
  );
}
