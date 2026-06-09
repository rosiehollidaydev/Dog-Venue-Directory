import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateReviewAction, deleteReviewAction } from "@/lib/actions";
import { CheckCircle, Trash2, Star } from "lucide-react";

export default async function AdminReviewsPage() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/admin/login");

  const reviews = await prisma.review.findMany({
    include: { venue: true },
    orderBy: { createdAt: "desc" },
  });

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">
          {pending.length} pending · {approved.length} approved
        </p>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Pending Review ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Approved ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 text-sm">No approved reviews yet</div>
        ) : (
          <div className="space-y-3">
            {approved.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ review }: { review: { id: string; author: string; email: string; rating: number; content: string; approved: boolean; createdAt: Date; venue: { name: string; slug: string } } }) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-charcoal text-sm">{review.author}</span>
            <span className="text-gray-400 text-xs">{review.email}</span>
            <div className="flex gap-0.5 ml-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{review.content}</p>
          <div className="text-xs text-gray-400">
            Venue: <span className="text-lavender">{review.venue.name}</span> ·{" "}
            {new Date(review.createdAt).toLocaleDateString("en-GB")}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!review.approved && (
            <form action={async () => { "use server"; await updateReviewAction(review.id, true); }}>
              <button type="submit" className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                <CheckCircle size={16} />
              </button>
            </form>
          )}
          {review.approved && (
            <form action={async () => { "use server"; await updateReviewAction(review.id, false); }}>
              <button type="submit" className="text-xs text-amber-600 hover:underline px-2 py-1">
                Unapprove
              </button>
            </form>
          )}
          <form action={async () => { "use server"; await deleteReviewAction(review.id); }}>
            <button type="submit" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
