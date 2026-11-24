import { useState } from 'react';
import { Menu, Plus, X } from 'lucide-react';
import { PageRoute } from '../types/mod';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenSubmit: () => void;
}

const NAV_ITEMS: { id: PageRoute; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'mods', label: 'Mods' },
  { id: 'categories', label: 'Categories' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'about', label: 'About' },
];

export function Navbar({ currentPage, onNavigate, onOpenSubmit }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="border-t-[6px] border-[#D93A30] border-b border-[#34323A] bg-[#17161A]">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#/home"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="font-display text-[22px] font-bold tracking-tight text-[#F3F1EC] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6A5F] rounded-sm"
        >
          BlockForge
        </a>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <a
                key={item.id}
                href={`#/${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.id);
                }}
                aria-current={active ? 'page' : undefined}
                className={`relative py-1 text-[15px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6A5F] rounded-sm ${
                  active
                    ? 'text-[#F3F1EC]'
                    : 'text-[#A8A39A] hover:text-[#F3F1EC]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[#FF6A5F]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSubmit}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D93A30] px-4 py-2 text-[14px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#FF6A5F] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A5F] cursor-pointer"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Submit Mod</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center rounded-xl border border-[#34323A] bg-[#222127] p-2.5 text-[#F3F1EC] hover:border-[#6F6B63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A5F] cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <nav
          className="border-t border-[#34323A] bg-[#1C1B20] px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[15px] font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2B2A31] text-[#FF6A5F]'
                      : 'text-[#F3F1EC] hover:bg-[#222127]'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="text-xs font-medium text-[#A8A39A]">Active</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
