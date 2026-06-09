import { prisma } from "@/lib/prisma";
import VenueCard from "@/components/venue/VenueCard";
import SearchBar from "@/components/search/SearchBar";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Dog-Friendly Venues",
  description: "Browse all dog-friendly pubs, restaurants, cafés and hotels in Newcastle upon Tyne.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    area?: string;
    city?: string;
    dogsInside?: string;
    waterBowls?: string;
    dogTreats?: string;
    outdoorSeating?: string;
    dogMenu?: string;
    overnightStays?: string;
    featured?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 12;

async function getVenues(params: Awaited<PageProps["searchParams"]>) {
  const page = parseInt(params.page || "1");
  const skip = (page - 1) * PAGE_SIZE;

  const where: Record<string, unknown> = {};

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { address: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.category) where.category = { slug: params.category };
  if (params.area) where.area = { slug: params.area };
  if (params.city) where.city = { slug: params.city };
  if (params.dogsInside === "true") where.dogsInside = true;
  if (params.waterBowls === "true") where.waterBowls = true;
  if (params.dogTreats === "true") where.dogTreats = true;
  if (params.outdoorSeating === "true") where.outdoorSeating = true;
  if (params.dogMenu === "true") where.dogMenu = true;
  if (params.overnightStays === "true") where.overnightStays = true;
  if (params.featured === "true") where.featured = true;

  const [venues, total, categories, areas, cities] = await Promise.all([
    prisma.venue.findMany({
      where,
      take: PAGE_SIZE,
      skip,
      include: { category: true, area: true, city: true },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.venue.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.area.findMany({ orderBy: { name: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
  ]);

  return { venues, total, categories, areas, cities, page, pageCount: Math.ceil(total / PAGE_SIZE) };
}

export default async function VenuesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { venues, total, categories, areas, cities, page, pageCount } = await getVenues(params);

  const categoryOptions = categories.map((c) => ({ value: c.slug, label: c.name }));
  const areaOptions = areas.map((a) => ({ value: a.slug, label: a.name }));
  const cityOptions = cities.map((c) => ({ value: c.slug, label: c.name }));

  return (
    <div className="page-container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Dog-Friendly Venues</h1>
        <p className="text-gray-600">
          {total} venue{total !== 1 ? "s" : ""} found across Newcastle
        </p>
      </div>

      <div className="mb-8">
        <Suspense>
          <SearchBar
            categories={categoryOptions}
            areas={areaOptions}
            cities={cityOptions}
          />
        </Suspense>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-xl font-semibold text-charcoal mb-2">No venues found</h2>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => {
                const sp = new URLSearchParams();
                Object.entries(params).forEach(([k, v]) => {
                  if (v && k !== "page") sp.set(k, v);
                });
                if (p > 1) sp.set("page", String(p));
                return (
                  <a
                    key={p}
                    href={`/venues?${sp.toString()}`}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-lavender text-white"
                        : "bg-white border border-gray-200 text-charcoal hover:border-lavender"
                    }`}
                  >
                    {p}
                  </a>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
