'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Settings, Box, Image as ImageIcon,
  LayoutTemplate, LogOut, ChevronDown, ChevronRight, Package, Tag, Layers,
  Gift, Ticket, Percent, Truck, Globe, Palette, Search as SearchIcon,
  Share2, MessageCircle, Bell, Smartphone, BarChart3, Shield, Activity,
  Clock, CreditCard, MapPin, Star, FileText, Megaphone, UserCog, Lock,
  Home, Navigation, Type, Monitor, Zap, TrendingUp, ShoppingCart, UserCheck
} from 'lucide-react';
import { logoutAction } from '../../admin-login/actions';
import { useApp } from '@/components/providers/AppProvider';

type NavSection = {
  titleEn: string;
  titleAr: string;
  items: NavItem[];
};

type NavItem = {
  nameEn: string;
  nameAr: string;
  href: string;
  icon: any;
  children?: { nameEn: string; nameAr: string; href: string }[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    titleEn: '', titleAr: '',
    items: [
      { nameEn: 'Overview', nameAr: 'نظرة عامة', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    titleEn: 'Operations', titleAr: 'العمليات',
    items: [
      { 
        nameEn: 'Orders', nameAr: 'الطلبات', href: '/dashboard/orders', icon: ShoppingBag,
        children: [
          { nameEn: 'All Orders', nameAr: 'جميع الطلبات', href: '/dashboard/orders' },
          { nameEn: 'Live Orders', nameAr: 'الطلبات الحية', href: '/dashboard/orders/live' },
        ]
      },
      { nameEn: 'Customers', nameAr: 'العملاء', href: '/dashboard/customers', icon: Users },
    ]
  },
  {
    titleEn: 'Catalog', titleAr: 'الكاتالوج',
    items: [
      { nameEn: 'Products', nameAr: 'المنتجات', href: '/dashboard/catalog/products', icon: Box },
      { nameEn: 'Categories', nameAr: 'الأقسام', href: '/dashboard/catalog/categories', icon: Layers },
      { nameEn: 'Variants', nameAr: 'المتغيرات', href: '/dashboard/catalog/variants', icon: Tag },
      { nameEn: 'Add-ons', nameAr: 'الإضافات', href: '/dashboard/catalog/addons', icon: Zap },
      { nameEn: 'Packages', nameAr: 'الباقات', href: '/dashboard/catalog/packages', icon: Package },
    ]
  },
  {
    titleEn: 'Marketing', titleAr: 'التسويق',
    items: [
      { nameEn: 'Offers', nameAr: 'العروض', href: '/dashboard/marketing/offers', icon: Gift },
      { nameEn: 'Coupons', nameAr: 'الكوبونات', href: '/dashboard/marketing/coupons', icon: Ticket },
      { nameEn: 'First Order', nameAr: 'أول طلب', href: '/dashboard/marketing/first-order', icon: Percent },
      { nameEn: 'Campaigns', nameAr: 'الحملات', href: '/dashboard/marketing/campaigns', icon: Megaphone },
    ]
  },
  {
    titleEn: 'Website', titleAr: 'الموقع',
    items: [
      { nameEn: 'Homepage', nameAr: 'الصفحة الرئيسية', href: '/dashboard/website/homepage', icon: Home },
      { nameEn: 'Hero', nameAr: 'البانر الرئيسي', href: '/dashboard/website/hero', icon: Monitor },
      { nameEn: 'Announcement', nameAr: 'شريط الإعلانات', href: '/dashboard/website/announcement', icon: Type },
      { nameEn: 'Navigation', nameAr: 'التنقل', href: '/dashboard/website/navigation', icon: Navigation },
      { nameEn: 'Reviews', nameAr: 'التقييمات', href: '/dashboard/website/reviews', icon: Star },
      { nameEn: 'Media Library', nameAr: 'مكتبة الوسائط', href: '/dashboard/website/media', icon: ImageIcon },
    ]
  },
  {
    titleEn: 'App', titleAr: 'التطبيق',
    items: [
      { nameEn: 'PWA Settings', nameAr: 'إعدادات التطبيق', href: '/dashboard/app/pwa', icon: Smartphone },
      { nameEn: 'Notifications', nameAr: 'الإشعارات', href: '/dashboard/app/notifications', icon: Bell },
    ]
  },
  {
    titleEn: 'Analytics', titleAr: 'التحليلات',
    items: [
      { nameEn: 'Overview', nameAr: 'نظرة عامة', href: '/dashboard/analytics', icon: BarChart3 },
      { nameEn: 'Sales', nameAr: 'المبيعات', href: '/dashboard/analytics/sales', icon: TrendingUp },
      { nameEn: 'Products', nameAr: 'المنتجات', href: '/dashboard/analytics/products', icon: Box },
      { nameEn: 'Customers', nameAr: 'العملاء', href: '/dashboard/analytics/customers', icon: UserCheck },
    ]
  },
  {
    titleEn: 'Settings', titleAr: 'الإعدادات',
    items: [
      { nameEn: 'General', nameAr: 'عام', href: '/dashboard/settings/general', icon: Settings },
      { nameEn: 'Business Hours', nameAr: 'ساعات العمل', href: '/dashboard/settings/hours', icon: Clock },
      { nameEn: 'Delivery', nameAr: 'التوصيل', href: '/dashboard/settings/delivery', icon: Truck },
      { nameEn: 'Delivery Zones', nameAr: 'مناطق التوصيل', href: '/dashboard/settings/zones', icon: MapPin },
      { nameEn: 'Checkout', nameAr: 'الدفع', href: '/dashboard/settings/checkout', icon: ShoppingCart },
      { nameEn: 'Payments', nameAr: 'طرق الدفع', href: '/dashboard/settings/payments', icon: CreditCard },
      { nameEn: 'Localization', nameAr: 'اللغة', href: '/dashboard/settings/localization', icon: Globe },
      { nameEn: 'Theme', nameAr: 'المظهر', href: '/dashboard/settings/theme', icon: Palette },
      { nameEn: 'SEO', nameAr: 'تحسين البحث', href: '/dashboard/settings/seo', icon: SearchIcon },
      { nameEn: 'Social', nameAr: 'التواصل الاجتماعي', href: '/dashboard/settings/social', icon: Share2 },
      { nameEn: 'WhatsApp', nameAr: 'واتساب', href: '/dashboard/settings/whatsapp', icon: MessageCircle },
    ]
  },
  {
    titleEn: 'Admin', titleAr: 'الإدارة',
    items: [
      { nameEn: 'Admin Users', nameAr: 'المديرين', href: '/dashboard/admin/users', icon: UserCog },
      { nameEn: 'Roles & Permissions', nameAr: 'الأدوار والصلاحيات', href: '/dashboard/admin/roles', icon: Lock },
      { nameEn: 'Activity Logs', nameAr: 'سجل النشاط', href: '/dashboard/admin/activity', icon: Activity },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { language } = useApp();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon">T</div>
          {!collapsed && (
            <span className="admin-brand-text">
              {language === 'ar' ? 'تمارا كيتشن' : 'Tamara Kitchen'}
            </span>
          )}
        </div>
      </div>
      
      <nav className="admin-sidebar-nav">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="admin-nav-section">
            {section.titleEn && !collapsed && (
              <div className="admin-nav-section-title">
                {language === 'ar' ? section.titleAr : section.titleEn}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const expanded = expandedSections[item.href];

              return (
                <div key={item.href}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleSection(item.href)}
                        className={`admin-nav-item ${active ? 'active' : ''}`}
                        style={{ width: '100%', textAlign: 'inherit' }}
                      >
                        <Icon className="admin-nav-icon" />
                        {!collapsed && (
                          <>
                            <span style={{ flex: 1 }}>{language === 'ar' ? item.nameAr : item.nameEn}</span>
                            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </>
                        )}
                      </button>
                      {expanded && !collapsed && (
                        <div className="admin-nav-children">
                          {item.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`admin-nav-child ${pathname === child.href ? 'active' : ''}`}
                            >
                              {language === 'ar' ? child.nameAr : child.nameEn}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link 
                      href={item.href}
                      className={`admin-nav-item ${active ? 'active' : ''}`}
                    >
                      <Icon className="admin-nav-icon" />
                      {!collapsed && (language === 'ar' ? item.nameAr : item.nameEn)}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <form action={logoutAction}>
          <button type="submit" className="admin-logout-btn">
            <LogOut className="admin-nav-icon" />
            {!collapsed && <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
