import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, CheckCircle, Star, MapPin } from "lucide-react";
import { deleteVenueAction } from "@/lib/actions";

export default async function AdminVenuesPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const venues = await prisma.venue.findMany({
    include: { category: true, area: true, city: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Venues</h1>
          <p className="text-gray-500 text-sm mt-1">{venues.length} venues total</p>
        </div>
        <Link href="/admin/venues/new" className="btn-primary rounded-xl">
          <Plus size={16} />
          Add Venue
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Area</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {venues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No venues yet.{" "}
                    <Link href="/admin/venues/new" className="text-lavender hover:underline">
                      Add your first venue.
                    </Link>
                  </td>
                </tr>
              ) : (
                venues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-charcoal">{venue.name}</div>
                      <div className="text-xs text-gray-400">/{venue.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{venue.category.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {venue.area?.name ?? "—"}, {venue.city.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {venue.verified ? (
                          <span className="badge badge-mint inline-flex w-fit">
                            <CheckCircle size={10} /> Verified
                          </span>
                        ) : (
                          <span className="badge bg-amber-50 text-amber-700 inline-flex w-fit">Unverified</span>
                        )}
                        {venue.featured && (
                          <span className="badge bg-lavender/20 text-purple-700 inline-flex w-fit">
                            <Star size={10} /> Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/venues/${venue.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-lavender hover:bg-lavender/10 transition-colors"
                          title="View"
                        >
                          <MapPin size={14} />
                        </Link>
                        <Link
                          href={`/admin/venues/${venue.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-lavender hover:bg-lavender/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteVenueAction(venue.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                            onClick={(e) => {
                              if (!confirm(`Delete "${venue.name}"? This cannot be undone.`)) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
