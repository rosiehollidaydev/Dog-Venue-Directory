import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateClaimAction } from "@/lib/actions";

export default async function AdminClaimsPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const claims = await prisma.claimRequest.findMany({
    include: { venue: true },
    orderBy: { createdAt: "desc" },
  });

  const statusColor: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Claim Requests</h1>
        <p className="text-gray-500 text-sm mt-1">
          {claims.filter((c) => c.status === "pending").length} pending
        </p>
      </div>

      {claims.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-gray-500">No claim requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-charcoal">{claim.name}</span>
                    <span className={`badge border text-xs ${statusColor[claim.status] || ""}`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Email: <span className="text-charcoal">{claim.email}</span></div>
                    {claim.phone && <div>Phone: <span className="text-charcoal">{claim.phone}</span></div>}
                    <div>Venue: <span className="text-lavender font-medium">{claim.venue.name}</span></div>
                    {claim.message && <div className="text-gray-500 italic mt-2">&ldquo;{claim.message}&rdquo;</div>}
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(claim.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                </div>
                {claim.status === "pending" && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <form action={async () => { "use server"; await updateClaimAction(claim.id, "approved"); }}>
                      <button type="submit" className="w-full px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors">
                        Approve
                      </button>
                    </form>
                    <form action={async () => { "use server"; await updateClaimAction(claim.id, "rejected"); }}>
                      <button type="submit" className="w-full px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors border border-red-200">
                        Reject
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
