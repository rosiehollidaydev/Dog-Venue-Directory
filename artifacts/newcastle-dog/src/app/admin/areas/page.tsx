import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAreaAction, deleteAreaAction } from "@/lib/actions";
import { Trash2 } from "lucide-react";

export default async function AdminAreasPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const [areas, cities] = await Promise.all([
    prisma.area.findMany({
      include: { city: true, _count: { select: { venues: true } } },
      orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Areas</h1>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-charcoal mb-4">Add Area</h2>
        <form action={createAreaAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Name *</label>
            <input name="name" required className="form-input" placeholder="Jesmond" />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input name="slug" required className="form-input" placeholder="jesmond" />
          </div>
          <div>
            <label className="form-label">City *</label>
            <select name="cityId" required className="form-input">
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" className="btn-primary rounded-xl">Add Area</button>
          </div>
        </form>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">City</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Venues</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {areas.map((area) => (
              <tr key={area.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-charcoal">{area.name}</td>
                <td className="px-4 py-3 text-gray-600">{area.city.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{area.slug}</td>
                <td className="px-4 py-3 text-gray-600">{area._count.venues}</td>
                <td className="px-4 py-3">
                  <form action={async () => { "use server"; await deleteAreaAction(area.id); }}>
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
