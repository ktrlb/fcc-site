"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, Facebook, Youtube, Instagram, ExternalLink } from "lucide-react";

// Top row navigation (social links, watch now, give)
const topNavigation = [
  { name: "Facebook", href: "https://www.facebook.com/fccgranbury", icon: Facebook, external: true },
  { name: "Instagram", href: "https://www.instagram.com/fccgranbury", icon: Instagram, external: true },
  { name: "YouTube", href: "https://www.youtube.com/@fccgranburytx", icon: Youtube, external: true },
  { name: "Watch Now", href: "https://www.fccgranbury.live/", external: true },
  { name: "Give", href: "/give" },
];

// Bottom row navigation (main navigation)
const navigation = [
  { name: "Visit FCC", href: "/visit" },
  { 
    name: "Learn About FCC", 
    href: "/about-us",
      dropdown: [
        { name: "Our Mission, Vision & Values", href: "/about-us#beliefs" },
        { name: "Our Staff", href: "/about-us#staff" },
        { name: "Our Leadership", href: "/about-us#leadership" },
        { name: "Our History", href: "/about-us#history" },
      ]
  },
  { name: "Explore Ministries", href: "/ministry-database" },
  { 
    name: "Links & Resources", 
    href: "#",
    dropdown: [
      { name: "Calendar", href: "/calendar" },
      { name: "La Reunión", href: "https://www.la-reunion.org", external: true },
      { name: "FCC Library", href: "/library" },
      { name: "Church Directory", href: "/directory" },
    ]
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' }}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8" aria-label="Global">
        {/* Left side - Logo and church name */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">First Christian Church Granbury</span>
            <div className="flex items-center space-x-3">
              <Image
                src="/images/Basic FCC Logo Assets-Transparent.png"
                alt="First Christian Church Granbury"
                width={56}
                height={56}
                className="h-14 w-14 object-contain mx-1"
              />
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-gray-900 font-sans leading-tight">First Christian Church</div>
                <div className="text-lg font-semibold text-gray-800 italic font-serif -mt-1">of Granbury, Texas</div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Right side - All navigation content */}
        <div className="flex flex-col items-end gap-1">
          {/* Top row - Social links, watch now, give */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-6">
            {topNavigation.map((item) => {
              if (item.icon) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label={item.name}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                  </a>
                );
              }
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  {item.name}
                  {item.external && <ExternalLink className="h-3 w-3" />}
                </a>
              );
            })}
          </div>
          
          {/* Bottom row - Main navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => {
              if (item.dropdown) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className="text-base font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1">
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {item.dropdown.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.name} asChild>
                          {dropdownItem.external ? (
                            <a 
                              href={dropdownItem.href} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="cursor-pointer"
                            >
                              {dropdownItem.name}
                            </a>
                          ) : (
                            <Link href={dropdownItem.href} className="cursor-pointer">
                              {dropdownItem.name}
                            </Link>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              
              if ('external' in item && item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Church name header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="text-lg font-bold text-gray-900 font-sans leading-tight">First Christian Church</div>
                  <div className="text-base font-semibold text-gray-800 italic font-serif -mt-1">of Granbury, Texas</div>
                </div>
                
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                  {/* Main navigation first */}
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Navigate</div>
                    {navigation.map((item) => {
                      if (item.dropdown) {
                        return (
                          <div key={item.name} className="space-y-2">
                            <div className="text-lg font-medium text-gray-900">{item.name}</div>
                            <div className="ml-4 space-y-2">
                              {item.dropdown.map((dropdownItem) => (
                                dropdownItem.external ? (
                                  <a
                                    key={dropdownItem.name}
                                    href={dropdownItem.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-base text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {dropdownItem.name}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                ) : (
                                  <Link
                                    key={dropdownItem.name}
                                    href={dropdownItem.href}
                                    className="block text-base text-gray-600 hover:text-blue-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {dropdownItem.name}
                                  </Link>
                                )
                              ))}
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors block"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                  
                  {/* Connect section at bottom */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Connect</div>
                    
                    {/* Social icons */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700">Follow Us</div>
                      <div className="flex items-center gap-4">
                        {topNavigation.filter(item => item.icon).map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                            aria-label={item.name}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.icon && <item.icon className="h-6 w-6" />}
                          </a>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action links */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700">Quick Actions</div>
                      {topNavigation.filter(item => !item.icon).map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 block"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                          {item.external && <ExternalLink className="h-4 w-4" />}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
