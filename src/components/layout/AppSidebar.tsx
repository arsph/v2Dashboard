'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, CreditCard, PlusCircle, LogOut } from 'lucide-react'; // Added LogOut
import { useAuth } from '@/context/AuthContext'; // Import useAuth

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
// Button component might not be needed if SidebarMenuButton is used directly for logout
// import { Button } from '@/components/ui/button'; 
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/sales', label: 'Sales', icon: DollarSign },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
];

const managementItems = [
  { href: '/import-sales', label: 'Add New Sale', icon: PlusCircle },
  { href: '/import-expenses', label: 'Add New Expense', icon: PlusCircle },
]

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, isAuthenticated } = useAuth(); // Get logout function and isAuthenticated

  // Do not render sidebar if not authenticated (e.g., on login page)
  // ProtectedLayout and AuthProvider handle showing/hiding based on auth and route.
  // So, if AppSidebar is rendered, we can assume isAuthenticated is true for its context.

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img src="/img/logo.png" alt="v2Dashboard Logo" className="h-8 w-8" />
          <h2 className="text-lg font-semibold text-sidebar-primary group-data-[collapsible=icon]:hidden">
            v2Dashboard
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <SidebarSeparator />

        <SidebarGroup>
           <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Management</SidebarGroupLabel>
           <SidebarMenu>
             {managementItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    >
                    <a>
                        <item.icon />
                        <span>{item.label}</span>
                    </a>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
           </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenuButton
            asChild
            tooltip="Logout"
            onClick={(e) => {
              e.preventDefault(); // Prevent any default link behavior if 'a' tag is used
              logout();
            }}
          >
          {/* Using an 'a' tag or a 'button' tag here depends on styling and accessibility preferences.
              Since SidebarMenuButton can act as a button, 'a' is fine for visual consistency. */}
          <a><LogOut /> <span>Logout</span></a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
