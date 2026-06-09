import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Trash2, ExternalLink } from "lucide-react";

async function createAffiliateLinkAction(formData: FormData) {
  "use server";
  await prisma.affiliateLink.create({
    data: {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
      active: true,
    },
  });
  revalidatePath("/admin/affiliates");
}

async function deleteAffiliateLinkAction(id: string) {
  "use server";
  await prisma.affiliateLink.delete({ where: { id } });
  revalidatePath("/admin/affiliates");
}

async function toggleActiveLinkAction(id: string, active: boolean) {
  "use server";
  await prisma.affiliateLink.update({ where: { id }, data: { active } });
  revalidatePath("/admin/affiliates");
}

export default async function AdminAffiliatesPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const links = await prisma.affiliateLink.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Affiliate Links</h1>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-charcoal mb-4">Add Affiliate Link</h2>
        <form action={createAffiliateLinkAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Name *</label>
            <input name="name" required className="form-input" placeholder="Booking.com Newcastle" />
          </div>
          <div>
            <label className="form-label">URL *</label>
            <input name="url" type="url" required className="form-input" placeholder="https://..." />
          </div>
          <div>
            <button type="submit" className="btn-primary rounded-xl">Add Link</button>
          </div>
        </form>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">URL</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {links.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No affiliate links yet</td></tr>
            )}
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-charcoal">{link.name}</td>
                <td className="px-4 py-3 max-w-xs">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-lavender hover:underline text-xs flex items-center gap-1 truncate">
                    {link.url} <ExternalLink size={10} className="shrink-0" />
                  </a>
                </td>
                <td className="px-4 py-3">
                  <form action={async () => { "use server"; await toggleActiveLinkAction(link.id, !link.active); }}>
                    <button type="submit" className={`badge border text-xs ${link.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                      {link.active ? "Active" : "Inactive"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={async () => { "use server"; await deleteAffiliateLinkAction(link.id); }}>
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
