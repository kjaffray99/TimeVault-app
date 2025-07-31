/**
 * 🧭 TIMEVAULT NAVIGATION COMPONENT
 * Main navigation with premium features and mobile responsiveness
 */

'use client';

import {
  BookOpen,
  Calculator,
  Crown,
  GraduationCap,
  Menu,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

const NAVIGATION_ITEMS = [
  {
    href: '/',
    label: 'Calculator',
    icon: Calculator,
    description: 'Convert crypto to precious metals and time'
  },
  {
    href: '/education',
    label: 'Education',
    icon: GraduationCap,
    description: 'Learn crypto investing and strategies'
  },
  {
    href: '/portfolio',
    label: 'Portfolio',
    icon: TrendingUp,
    description: 'Track your investments',
    premium: true
  },
  {
    href: '/academy',
    label: 'Academy',
    icon: BookOpen,
    description: 'Advanced courses and certifications',
    premium: true
  }
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const pathname = usePathname();

  const handleNavClick = useCallback((href: string, premium?: boolean) => {
    if (premium) {
      setShowPremiumModal(true);
      setIsMenuOpen(false);
      return;
    }
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <nav className="bg-[#001F3F]/95 backdrop-blur-sm border-b border-[#D4AF37]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-[#001F3F]" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">TimeVault</div>
                <div className="text-xs text-[#D4AF37] -mt-1">AI</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.premium ? '#' : item.href}
                    onClick={() => handleNavClick(item.href, item.premium)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all group ${isActive
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        : 'text-white hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.premium && (
                      <Crown className="w-4 h-4 text-[#D4AF37] group-hover:animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => setShowPremiumModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] font-bold rounded-lg hover:from-[#B8941F] hover:to-[#D4AF37] transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Premium</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-all">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-[#D4AF37]/10 rounded-lg transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#001F3F] border-t border-[#D4AF37]/20">
            <div className="px-4 py-4 space-y-2">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.premium ? '#' : item.href}
                    onClick={() => handleNavClick(item.href, item.premium)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        : 'text-white hover:bg-[#D4AF37]/10'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium flex items-center">
                        {item.label}
                        {item.premium && (
                          <Crown className="w-4 h-4 text-[#D4AF37] ml-2" />
                        )}
                      </div>
                      <div className="text-sm text-[#C0C0C0]">{item.description}</div>
                    </div>
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-[#D4AF37]/20 space-y-2">
                <button
                  onClick={() => {
                    setShowPremiumModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] font-bold rounded-lg"
                >
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Premium</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#003366] text-white rounded-lg">
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#001F3F] border border-[#D4AF37] rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <Crown className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Unlock Premium Features</h2>
              <p className="text-[#C0C0C0] mb-6">
                Get access to advanced portfolio tracking, premium education content,
                and AI-powered investment insights.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-[#C0C0C0]">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></div>
                  Advanced Portfolio Analytics
                </div>
                <div className="flex items-center text-[#C0C0C0]">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></div>
                  Premium Education Courses
                </div>
                <div className="flex items-center text-[#C0C0C0]">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></div>
                  Real-time Price Alerts
                </div>
                <div className="flex items-center text-[#C0C0C0]">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></div>
                  AI Investment Insights
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] font-bold py-3 px-6 rounded-lg hover:from-[#B8941F] hover:to-[#D4AF37] transition-all">
                  Start 7-Day Free Trial
                </button>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#004080] transition-all"
                >
                  Continue with Free
                </button>
              </div>

              <p className="text-xs text-[#C0C0C0] mt-4">
                Cancel anytime. No commitments.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
