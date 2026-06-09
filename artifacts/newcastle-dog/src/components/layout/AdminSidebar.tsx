"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Tag,
  Sparkles,
  Star,
  MessageSquare,
  FileText,
  Link as LinkIcon,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { logoutAction } from "@/lib/actions";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/venues", label: "Venues", icon: MapPin },
  { href: "/admin/cities", label: "Cities", icon: Building2 },
  { href: "/admin/areas", label: "Areas", icon: MapPin },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/amenities", label: "Amenities", icon: Sparkles },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/claims", label: "Claim Requests", icon: FileText },
  { href: "/admin/featured", label: "Featured", icon: Star },
  { href: "/admin/affiliates", label: "Affiliate Links", icon: LinkIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-charcoal text-white flex flex-col shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <div className="leading-none">
            <span className="font-bold text-white text-base">Newcastle</span>
            <span className="font-bold text-neon-mint text-base">.dog</span>
            <div className="text-xs text-white/40 mt-0.5">Admin</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                active
                  ? "bg-lavender text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon size={16} className={active ? "text-white" : "text-white/40 group-hover:text-white"} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <MapPin size={16} />
          View Site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
