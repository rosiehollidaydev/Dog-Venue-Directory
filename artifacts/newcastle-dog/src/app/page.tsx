import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VenueCard from "@/components/venue/VenueCard";
import { MapPin, Search, Star, CheckCircle, ArrowRight } from "lucide-react";

async function getHomeData() {
  const [featuredVenues, recentVenues, stats, categories, areas] = await Promise.all([
    prisma.venue.findMany({
      where: { featured: true },
      take: 6,
      include: { category: true, area: true, city: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.venue.findMany({
      take: 6,
      include: { category: true, area: true, city: true },
      orderBy: { createdAt: "desc" },
    }),
    Promise.all([
      prisma.venue.count(),
      prisma.venue.count({ where: { verified: true } }),
      prisma.city.count(),
    ]),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.area.findMany({ take: 7, orderBy: { name: "asc" } }),
  ]);

  return { featuredVenues, recentVenues, stats, categories, areas };
}

const categoryConfig: Record<string, { icon: string; color: string; href: string }> = {
  pubs: { icon: "🍺", color: "bg-amber-50 border-amber-200 text-amber-700", href: "/pubs" },
  restaurants: { icon: "🍽️", color: "bg-rose-50 border-rose-200 text-rose-700", href: "/restaurants" },
  cafes: { icon: "☕", color: "bg-orange-50 border-orange-200 text-orange-700", href: "/cafes" },
  hotels: { icon: "🛏️", color: "bg-blue-50 border-blue-200 text-blue-700", href: "/hotels" },
};

export default async function HomePage() {
  const { featuredVenues, recentVenues, stats, categories, areas } = await getHomeData();
  const [totalVenues, verifiedVenues, totalCities] = stats;

  return (
    <div>
      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #0A0518 0%, #160B3D 30%, #27126B 65%, #4A2BAA 100%)" }}>
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at 10% 60%, #9D8DF1 0%, transparent 45%), radial-gradient(ellipse at 90% 10%, #1CFEBA 0%, transparent 35%), radial-gradient(ellipse at 70% 90%, #B8CDF8 0%, transparent 40%)`,
            opacity: 0.25,
          }}
        />
        <div className="page-container py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 backdrop-blur">
              🐾 Newcastle's Dog-Friendly Directory
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find the best{" "}
              <span className="text-neon-mint">dog-friendly</span>{" "}
              venues in Newcastle
            </h1>
            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              Discover pubs, restaurants, cafés and hotels across Newcastle where you and your four-legged friend are genuinely welcome.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/venues" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-neon-mint text-charcoal font-bold text-base hover:brightness-110 transition-all">
                <Search size={18} />
                Search Venues
              </Link>
              <Link href="/pubs" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-medium text-base hover:bg-white/20 transition-all border border-white/20">
                Browse Pubs
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10">
          <div className="page-container py-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-neon-mint">{totalVenues}+</div>
                <div className="text-white/60 text-sm mt-0.5">Dog-friendly venues</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neon-mint">{verifiedVenues}</div>
                <div className="text-white/60 text-sm mt-0.5">Verified listings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neon-mint">{totalCities}</div>
                <div className="text-white/60 text-sm mt-0.5">Cities covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 bg-purple-soft dark:bg-purple-night">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Browse by category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const config = categoryConfig[cat.slug] || { icon: "🐾", color: "bg-lavender/10 border-lavender/30 text-purple-rich", href: `/venues?category=${cat.slug}` };
              return (
                <Link
                  key={cat.id}
                  href={config.href}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:shadow-lg hover:shadow-lavender/20 hover:-translate-y-1 dark:bg-purple-deep/60 dark:border-purple-mid/40 dark:text-purple-pale ${config.color}`}
                >
                  <span className="text-4xl">{config.icon}</span>
                  <span className="font-semibold text-sm">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured venues */}
      {featuredVenues.length > 0 && (
        <section className="py-14 bg-white dark:bg-purple-deep/40">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Featured venues</h2>
                <p className="text-gray-500 dark:text-purple-pale/60 text-sm mt-1">Hand-picked dog-friendly favourites</p>
              </div>
              <Link href="/venues?featured=true" className="text-lavender hover:text-lavender/80 text-sm font-medium flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Areas */}
      <section className="py-14 text-white" style={{ background: "linear-gradient(135deg, #160B3D 0%, #27126B 50%, #4A2BAA 100%)" }}>
        <div className="page-container">
          <h2 className="text-2xl font-bold mb-2">Explore by area</h2>
          <p className="text-white/60 text-sm mb-8">Find dog-friendly spots in your neighbourhood</p>
          <div className="flex flex-wrap gap-3">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/areas/${area.slug}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-lavender/30 hover:border-lavender/60"
              >
                <MapPin size={14} className="text-lavender" />
                {area.name}
              </Link>
            ))}
            <Link
              href="/venues"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lavender hover:opacity-90 text-white font-semibold text-sm transition-opacity"
            >
              View all areas <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent venues */}
      <section className="py-14 bg-purple-soft dark:bg-purple-night">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Recently added</h2>
              <p className="text-purple-mid/70 dark:text-purple-pale/60 text-sm mt-1">New dog-friendly spots in Newcastle</p>
            </div>
            <Link href="/venues" className="text-lavender hover:text-lavender/80 text-sm font-medium flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #27126B 0%, #9D8DF1 100%)" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, #1CFEBA 0%, transparent 40%)", opacity: 0.12 }} />
        <div className="page-container text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white/80 text-sm font-medium mb-6">
            🐾 Join the community
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Know a great dog-friendly spot?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto text-lg">
            Help other dog owners find amazing venues across Newcastle. Share your favourite dog-friendly place with the community.
          </p>
          <Link href="/venues" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-purple-rich font-bold text-base hover:opacity-95 transition-opacity">
            Browse All Venues
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
