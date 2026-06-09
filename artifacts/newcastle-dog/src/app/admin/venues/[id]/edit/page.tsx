import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateVenueAction } from "@/lib/actions";
import VenueForm from "@/components/admin/VenueForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVenuePage({ params }: PageProps) {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const { id } = await params;

  const [venue, cities, areas, categories] = await Promise.all([
    prisma.venue.findUnique({ where: { id } }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.area.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!venue) notFound();

  const action = updateVenueAction.bind(null, id);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/venues" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-charcoal text-sm mb-4 transition-colors">
          <ArrowLeft size={14} />
          Back to venues
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Edit: {venue.name}</h1>
      </div>
      <VenueForm
        action={action}
        cities={cities}
        areas={areas}
        categories={categories}
        defaultValues={{
          ...venue,
          areaId: venue.areaId ?? undefined,
          website: venue.website ?? undefined,
          affiliateUrl: venue.affiliateUrl ?? undefined,
          bookingUrl: venue.bookingUrl ?? undefined,
          phone: venue.phone ?? undefined,
          image: venue.image ?? undefined,
          sourceUrl: venue.sourceUrl ?? undefined,
          metaTitle: venue.metaTitle ?? undefined,
          metaDescription: venue.metaDescription ?? undefined,
        }}
        submitLabel="Update Venue"
      />
    </div>
  );
}
