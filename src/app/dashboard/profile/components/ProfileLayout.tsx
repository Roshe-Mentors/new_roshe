"use client";
import React from 'react';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { NavItem } from '../../components/common/DashboardComponents';

const navItems = [
  { icon: 'home', label: 'General', segment: 'general' },
  { icon: 'compass', label: 'Expertise', segment: 'expertise' },
  { icon: 'calendar', label: 'Availability', segment: 'availability' },
  { icon: 'community', label: 'Social Links', segment: 'social-links' },
  { icon: 'achievement', label: 'Calendar', segment: 'calendar' },
] as const;

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const current = segments[segments.length - 1] || 'general';
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r p-6 pt-16">
        <nav className="flex flex-col p-4 space-y-4">
          {navItems.map((item) => (
            <NavItem
              key={item.segment}
              icon={item.icon}
              label={item.label}
              active={current === item.segment}
              onClick={() => router.push(`/dashboard/profile/${item.segment}`)}
            />
          ))}
        </nav>
      </aside>
      <section className="flex-1 p-6 pt-16 bg-gray-50">
        {children}
      </section>
    </div>
  );
}