import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VenueCard from "@/components/venue/VenueCard";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = await prisma.city.findUnique({ where: { slug: citySlug } });
  if (!city) return { title: "City Not Found" };
  return {
    title: city.metaTitle || `Dog-Friendly Venues in ${city.name}`,
    description: city.metaDesc || `Find the best dog-friendly pubs, restaurants, cafés and hotels in ${city.name}.`,
  };
}

export default async function CityPage({ params }: PageProps) {
  const { city: citySlug } = await params;

  const city = await prisma.city.findUnique({
    where: { slug: citySlug },
    include: { areas: { orderBy: { name: "asc" } } },
  });
  if (!city) notFound();

  const venues = await prisma.venue.findMany({
    where: { cityId: city.id },
    include: { category: true, area: true, city: true },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    take: 12,
  });

  const total = await prisma.venue.count({ where: { cityId: city.id } });

  return (
    <div className="page-container py-10">
      <div className="mb-8">
        <nav className="text-xs text-gray-400 flex gap-1 items-center mb-4">
          <Link href="/" className="hover:text-lavender">Home</Link>
          <span>/</span>
          <span className="text-charcoal">{city.name}</span>
        </nav>
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={20} className="text-lavender" />
          <h1 className="text-3xl font-bold text-charcoal">
            Dog-Friendly Venues in {city.name}
          </h1>
        </div>
        {city.description && (
          <p className="text-gray-600 mt-2">{city.description}</p>
        )}
        <p className="text-gray-500 text-sm mt-2">{total} venues found</p>
      </div>

      {/* Areas */}
      {city.areas.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-charcoal mb-3">Browse by area</h2>
          <div className="flex flex-wrap gap-2">
            {city.areas.map((area) => (
              <Link
                key={area.id}
                href={`/areas/${area.slug}`}
                className="px-4 py-2 rounded-lg bg-lavender/10 text-lavender text-sm font-medium hover:bg-lavender/20 transition-colors"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Venues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {total > 12 && (
        <div className="mt-8 text-center">
          <Link href={`/venues?city=${city.slug}`} className="btn-primary px-8 py-3 rounded-xl">
            View all {total} venues <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
