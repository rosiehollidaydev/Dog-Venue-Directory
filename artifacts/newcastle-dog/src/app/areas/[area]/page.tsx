import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VenueCard from "@/components/venue/VenueCard";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ area: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area: areaSlug } = await params;
  const area = await prisma.area.findUnique({ where: { slug: areaSlug }, include: { city: true } });
  if (!area) return { title: "Area Not Found" };
  return {
    title: `Dog-Friendly Venues in ${area.name}, ${area.city.name}`,
    description: `Find dog-friendly pubs, restaurants, cafés and hotels in ${area.name}, ${area.city.name}.`,
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { area: areaSlug } = await params;

  const area = await prisma.area.findUnique({
    where: { slug: areaSlug },
    include: { city: true },
  });
  if (!area) notFound();

  const venues = await prisma.venue.findMany({
    where: { areaId: area.id },
    include: { category: true, area: true, city: true },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="page-container py-10">
      <nav className="text-xs text-gray-400 flex gap-1 items-center mb-6">
        <Link href="/" className="hover:text-lavender">Home</Link>
        <span>/</span>
        <Link href={`/cities/${area.city.slug}`} className="hover:text-lavender">{area.city.name}</Link>
        <span>/</span>
        <span className="text-charcoal">{area.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={20} className="text-lavender" />
          <h1 className="text-3xl font-bold text-charcoal">
            Dog-Friendly Venues in {area.name}
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          {area.city.name} · {venues.length} venue{venues.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-xl font-semibold text-charcoal mb-2">No venues in {area.name} yet</h2>
          <p className="text-gray-500 mb-6">Check back soon or browse all venues</p>
          <Link href="/venues" className="btn-primary px-8 py-3 rounded-xl">Browse all venues</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
