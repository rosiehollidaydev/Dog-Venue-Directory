import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function createAmenityAction(formData: FormData) {
  "use server";
  await prisma.amenity.create({
    data: {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      icon: (formData.get("icon") as string) || null,
    },
  });
  revalidatePath("/admin/amenities");
}

async function deleteAmenityAction(id: string) {
  "use server";
  await prisma.amenity.delete({ where: { id } });
  revalidatePath("/admin/amenities");
}

export default async function AdminAmenitiesPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const amenities = await prisma.amenity.findMany({
    include: { _count: { select: { venues: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Amenities</h1>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-charcoal mb-4">Add Amenity</h2>
        <form action={createAmenityAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Name *</label>
            <input name="name" required className="form-input" placeholder="Water Bowls" />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input name="slug" required className="form-input" placeholder="water-bowls" />
          </div>
          <div>
            <label className="form-label">Icon (emoji)</label>
            <input name="icon" className="form-input" placeholder="💧" />
          </div>
          <div>
            <button type="submit" className="btn-primary rounded-xl">Add Amenity</button>
          </div>
        </form>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Icon</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Venues</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {amenities.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No amenities yet</td></tr>
            )}
            {amenities.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-charcoal">{a.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{a.slug}</td>
                <td className="px-4 py-3 text-xl">{a.icon}</td>
                <td className="px-4 py-3 text-gray-600">{a._count.venues}</td>
                <td className="px-4 py-3">
                  <form action={async () => { "use server"; await deleteAmenityAction(a.id); }}>
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
