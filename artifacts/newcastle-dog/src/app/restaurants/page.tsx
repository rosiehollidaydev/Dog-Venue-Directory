export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import VenueCard from "@/components/venue/VenueCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog-Friendly Restaurants in Newcastle",
  description: "Find the best dog-friendly restaurants in Newcastle upon Tyne. Dine out with your dog.",
};

export default async function RestaurantsPage() {
  const category = await prisma.category.findUnique({ where: { slug: "restaurants" } });
  const venues = category
    ? await prisma.venue.findMany({
        where: { categoryId: category.id },
        include: { category: true, area: true, city: true },
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      })
    : [];

  return (
    <div className="page-container py-10">
      <nav className="text-xs text-gray-400 flex gap-1 items-center mb-6">
        <Link href="/" className="hover:text-lavender">Home</Link>
        <span>/</span>
        <span className="text-charcoal">Restaurants</span>
      </nav>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🍽️</span>
          <h1 className="text-3xl font-bold text-charcoal">Dog-Friendly Restaurants</h1>
        </div>
        <p className="text-gray-600">
          {venues.length} dog-friendly restaurant{venues.length !== 1 ? "s" : ""} in Newcastle
        </p>
      </div>
      {venues.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🍽️</span>
          <p className="text-gray-500">No restaurants found yet</p>
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
