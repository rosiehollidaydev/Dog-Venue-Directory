import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createVenueAction } from "@/lib/actions";
import VenueForm from "@/components/admin/VenueForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewVenuePage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const [cities, areas, categories] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.area.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/venues" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-charcoal text-sm mb-4 transition-colors">
          <ArrowLeft size={14} />
          Back to venues
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Add New Venue</h1>
      </div>
      <VenueForm
        action={createVenueAction}
        cities={cities}
        areas={areas}
        categories={categories}
        submitLabel="Create Venue"
      />
    </div>
  );
}
