import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, Building2, Tag, Star, MessageSquare, FileText, Plus, ArrowRight, CheckCircle, Clock } from "lucide-react";

async function getDashboardData() {
  const [
    totalVenues, verifiedVenues, featuredVenues, unverifiedVenues,
    totalCities, totalAreas, totalCategories,
    pendingReviews, pendingClaims,
    recentVenues,
  ] = await Promise.all([
    prisma.venue.count(),
    prisma.venue.count({ where: { verified: true } }),
    prisma.venue.count({ where: { featured: true } }),
    prisma.venue.count({ where: { verified: false } }),
    prisma.city.count(),
    prisma.area.count(),
    prisma.category.count(),
    prisma.review.count({ where: { approved: false } }),
    prisma.claimRequest.count({ where: { status: "pending" } }),
    prisma.venue.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true, area: true, city: true },
    }),
  ]);

  return {
    totalVenues, verifiedVenues, featuredVenues, unverifiedVenues,
    totalCities, totalAreas, totalCategories,
    pendingReviews, pendingClaims, recentVenues,
  };
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const data = await getDashboardData();

  const stats = [
    { label: "Total Venues", value: data.totalVenues, icon: MapPin, color: "bg-lavender/10 text-lavender", href: "/admin/venues" },
    { label: "Verified", value: data.verifiedVenues, icon: CheckCircle, color: "bg-mint/20 text-emerald-700", href: "/admin/venues" },
    { label: "Featured", value: data.featuredVenues, icon: Star, color: "bg-amber-50 text-amber-700", href: "/admin/featured" },
    { label: "Unverified", value: data.unverifiedVenues, icon: Clock, color: "bg-red-50 text-red-600", href: "/admin/venues" },
    { label: "Cities", value: data.totalCities, icon: Building2, color: "bg-ice-blue/20 text-blue-700", href: "/admin/cities" },
    { label: "Areas", value: data.totalAreas, icon: MapPin, color: "bg-ice-blue/20 text-blue-700", href: "/admin/areas" },
    { label: "Categories", value: data.totalCategories, icon: Tag, color: "bg-orange-50 text-orange-700", href: "/admin/categories" },
    { label: "Pending Reviews", value: data.pendingReviews, icon: MessageSquare, color: "bg-purple-50 text-purple-700", href: "/admin/reviews" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back{session.adminName ? `, ${session.adminName}` : ""}. Here&apos;s what&apos;s happening.
          </p>
        </div>
        <Link href="/admin/venues/new" className="btn-primary rounded-xl">
          <Plus size={16} />
          Add Venue
        </Link>
      </div>

      {/* Alert banners */}
      {data.pendingClaims > 0 && (
        <Link href="/admin/claims" className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors">
          <FileText size={18} />
          <span className="text-sm font-medium">
            {data.pendingClaims} claim request{data.pendingClaims !== 1 ? "s" : ""} pending review
          </span>
          <ArrowRight size={14} className="ml-auto" />
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="card p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <div className="text-2xl font-bold text-charcoal">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Recent venues */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-charcoal">Recently Added Venues</h2>
          <Link href="/admin/venues" className="text-lavender hover:text-lavender/80 text-sm font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {data.recentVenues.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No venues yet</div>
          ) : (
            data.recentVenues.map((venue) => (
              <div key={venue.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-lavender/10 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-lavender" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-charcoal text-sm truncate">{venue.name}</div>
                  <div className="text-xs text-gray-500">
                    {venue.category.name} · {venue.area?.name ?? venue.city.name}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {venue.verified ? (
                    <span className="badge badge-mint text-xs">Verified</span>
                  ) : (
                    <span className="badge bg-amber-50 text-amber-700 text-xs">Unverified</span>
                  )}
                  <Link
                    href={`/admin/venues/${venue.id}/edit`}
                    className="text-xs text-lavender hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
