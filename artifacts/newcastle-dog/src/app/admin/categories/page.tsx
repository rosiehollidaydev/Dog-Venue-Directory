import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCategoryAction, deleteCategoryAction } from "@/lib/actions";
import { Trash2 } from "lucide-react";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    include: { _count: { select: { venues: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Categories</h1>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-charcoal mb-4">Add Category</h2>
        <form action={createCategoryAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Name *</label>
            <input name="name" required className="form-input" placeholder="Pubs" />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input name="slug" required className="form-input" placeholder="pubs" />
          </div>
          <div>
            <label className="form-label">Icon (emoji)</label>
            <input name="icon" className="form-input" placeholder="🍺" />
          </div>
          <div>
            <label className="form-label">Description</label>
            <input name="description" className="form-input" />
          </div>
          <div>
            <button type="submit" className="btn-primary rounded-xl">Add Category</button>
          </div>
        </form>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Venues</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-charcoal">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-600">{cat._count.venues}</td>
                <td className="px-4 py-3">
                  <form action={async () => { "use server"; await deleteCategoryAction(cat.id); }}>
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
