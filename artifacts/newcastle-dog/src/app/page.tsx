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
      <section className="relative bg-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #9D8DF1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #95F2D9 0%, transparent 40%), radial-gradient(circle at 60% 80%, #B8CDF8 0%, transparent 40%)`,
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
      <section className="py-14 bg-gray-50">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Browse by category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const config = categoryConfig[cat.slug] || { icon: "🐾", color: "bg-lavender/10 border-lavender/30 text-lavender", href: `/venues?category=${cat.slug}` };
              return (
                <Link
                  key={cat.id}
                  href={config.href}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5 ${config.color}`}
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
        <section className="py-14">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Featured venues</h2>
                <p className="text-gray-500 text-sm mt-1">Hand-picked dog-friendly favourites</p>
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
      <section className="py-14 bg-charcoal text-white">
        <div className="page-container">
          <h2 className="text-2xl font-bold mb-2">Explore by area</h2>
          <p className="text-white/60 text-sm mb-8">Find dog-friendly spots in your neighbourhood</p>
          <div className="flex flex-wrap gap-3">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/areas/${area.slug}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/10"
              >
                <MapPin size={14} className="text-neon-mint" />
                {area.name}
              </Link>
            ))}
            <Link
              href="/venues"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neon-mint/20 hover:bg-neon-mint/30 text-neon-mint font-medium text-sm transition-colors border border-neon-mint/30"
            >
              View all areas <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent venues */}
      <section className="py-14">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Recently added</h2>
              <p className="text-gray-500 text-sm mt-1">New dog-friendly spots in Newcastle</p>
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
      <section className="py-14 bg-gradient-to-br from-lavender/10 to-ice-blue/10">
        <div className="page-container text-center">
          <h2 className="text-3xl font-bold text-charcoal mb-4">
            Know a great dog-friendly spot?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Help other dog owners find amazing venues across Newcastle. Share your favourite dog-friendly place with the community.
          </p>
          <Link href="/venues" className="btn-primary text-base px-8 py-4 rounded-xl">
            Browse All Venues
          </Link>
        </div>
      </section>
    </div>
  );
}
