import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCityAction, deleteCityAction } from "@/lib/actions";
import { Trash2 } from "lucide-react";

export default async function AdminCitiesPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const cities = await prisma.city.findMany({
    include: { _count: { select: { venues: true, areas: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Cities</h1>

      {/* Add form */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-charcoal mb-4">Add City</h2>
        <form action={createCityAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Name *</label>
            <input name="name" required className="form-input" placeholder="Newcastle upon Tyne" />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input name="slug" required className="form-input" placeholder="newcastle" />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Description</label>
            <input name="description" className="form-input" placeholder="Short description" />
          </div>
          <div>
            <label className="form-label">Meta Title</label>
            <input name="metaTitle" className="form-input" />
          </div>
          <div>
            <label className="form-label">Meta Description</label>
            <input name="metaDesc" className="form-input" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary rounded-xl">Add City</button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Areas</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Venues</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cities.map((city) => (
              <tr key={city.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-charcoal">{city.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{city.slug}</td>
                <td className="px-4 py-3 text-gray-600">{city._count.areas}</td>
                <td className="px-4 py-3 text-gray-600">{city._count.venues}</td>
                <td className="px-4 py-3">
                  <form action={async () => { "use server"; await deleteCityAction(city.id); }}>
                    <button type="submit" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
