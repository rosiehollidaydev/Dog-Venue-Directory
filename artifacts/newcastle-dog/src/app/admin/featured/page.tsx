import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toggleFeaturedAction } from "@/lib/actions";
import { Star, StarOff } from "lucide-react";

export default async function AdminFeaturedPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const venues = await prisma.venue.findMany({
    include: { category: true, area: true, city: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  const featured = venues.filter((v) => v.featured);
  const unfeatured = venues.filter((v) => !v.featured);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Featured Listings</h1>
        <p className="text-gray-500 text-sm mt-1">
          {featured.length} featured venue{featured.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-3 bg-lavender/5 border-b border-gray-100">
          <h2 className="font-semibold text-charcoal flex items-center gap-2">
            <Star size={16} className="text-lavender fill-lavender" />
            Currently Featured
          </h2>
        </div>
        {featured.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No featured venues</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {featured.map((venue) => (
              <VenueRow key={venue.id} venue={venue} isFeatured={true} />
            ))}
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-charcoal">All Other Venues</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {unfeatured.map((venue) => (
            <VenueRow key={venue.id} venue={venue} isFeatured={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VenueRow({ venue, isFeatured }: { venue: { id: string; name: string; category: { name: string }; area?: { name: string } | null; city: { name: string }; featured: boolean }; isFeatured: boolean }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-charcoal text-sm truncate">{venue.name}</div>
        <div className="text-xs text-gray-500">
          {venue.category.name} · {venue.area?.name ?? venue.city.name}
        </div>
      </div>
      <form action={async () => { "use server"; await toggleFeaturedAction(venue.id, !isFeatured); }}>
        <button
          type="submit"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isFeatured
              ? "bg-lavender/10 text-lavender hover:bg-red-50 hover:text-red-600"
              : "bg-gray-100 text-gray-600 hover:bg-lavender/10 hover:text-lavender"
          }`}
        >
          {isFeatured ? <><StarOff size={12} /> Unfeature</> : <><Star size={12} /> Feature</>}
        </button>
      </form>
    </div>
  );
}
