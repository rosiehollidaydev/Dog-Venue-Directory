import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AmenityBadge from "@/components/venue/AmenityBadge";
import { MapPin, Phone, Globe, ExternalLink, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const venue = await prisma.venue.findUnique({
    where: { slug },
    include: { city: true },
  });
  if (!venue) return { title: "Venue Not Found" };
  return {
    title: venue.metaTitle || `${venue.name} — Dog-Friendly in ${venue.city.name}`,
    description: venue.metaDescription || venue.description.slice(0, 160),
  };
}

export default async function VenueDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const venue = await prisma.venue.findUnique({
    where: { slug },
    include: { category: true, area: true, city: true },
  });

  if (!venue) notFound();

  const amenities = [
    { key: "dogsInside", label: "Dogs Inside", icon: "🏠", active: venue.dogsInside },
    { key: "waterBowls", label: "Water Bowls", icon: "💧", active: venue.waterBowls },
    { key: "dogTreats", label: "Dog Treats", icon: "🦴", active: venue.dogTreats },
    { key: "outdoorSeating", label: "Outdoor Seating", icon: "☀️", active: venue.outdoorSeating },
    { key: "dogMenu", label: "Dog Menu", icon: "🍽️", active: venue.dogMenu },
    { key: "overnightStays", label: "Overnight Stays", icon: "🛏️", active: venue.overnightStays },
  ];

  const activeAmenities = amenities.filter((a) => a.active);

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-lavender/20 to-ice-blue/20">
        {venue.image ? (
          <Image
            src={venue.image}
            alt={venue.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl opacity-20">🐾</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="page-container">
            <Link
              href="/venues"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to venues
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge bg-white/20 text-white backdrop-blur border border-white/30">
                {venue.category.name}
              </span>
              {venue.featured && (
                <span className="badge bg-lavender text-white">⭐ Featured</span>
              )}
              {venue.verified && (
                <span className="badge bg-neon-mint text-charcoal font-semibold">
                  <CheckCircle size={11} /> Verified
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{venue.name}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Location */}
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={16} className="mt-0.5 shrink-0 text-lavender" />
              <div>
                <span>{venue.address}</span>
                {venue.area && (
                  <>
                    {" "}·{" "}
                    <Link href={`/areas/${venue.area.slug}`} className="text-lavender hover:underline">
                      {venue.area.name}
                    </Link>
                  </>
                )}
                {" "}·{" "}
                <Link href={`/cities/${venue.city.slug}`} className="text-lavender hover:underline">
                  {venue.city.name}
                </Link>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-3">About</h2>
              <p className="text-gray-600 leading-relaxed">{venue.description}</p>
            </div>

            {/* Dog amenities */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-4">Dog-friendly features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((a) => (
                  <AmenityBadge
                    key={a.key}
                    label={a.label}
                    icon={a.icon}
                    active={a.active}
                  />
                ))}
              </div>
              {activeAmenities.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No specific amenities listed yet. Contact the venue for details.
                </p>
              )}
            </div>

            {/* Verification */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-charcoal">
                  Verification status:{" "}
                  <span className={venue.verified ? "text-emerald-600" : "text-amber-600"}>
                    {venue.verificationStatus.charAt(0).toUpperCase() + venue.verificationStatus.slice(1)}
                  </span>
                </span>
              </div>
              {venue.lastVerifiedAt && (
                <p className="text-xs text-gray-500 ml-5">
                  Last verified: {new Date(venue.lastVerifiedAt).toLocaleDateString("en-GB")}
                </p>
              )}
              {!venue.verified && (
                <p className="text-xs text-gray-500 mt-1">
                  This listing hasn&apos;t been verified yet. Information may be out of date.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact card */}
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-charcoal">Contact & Links</h3>

              {venue.phone && (
                <a
                  href={`tel:${venue.phone}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-lavender transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-lavender/10 flex items-center justify-center">
                    <Phone size={15} className="text-lavender" />
                  </div>
                  {venue.phone}
                </a>
              )}

              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-lavender transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-lavender/10 flex items-center justify-center">
                    <Globe size={15} className="text-lavender" />
                  </div>
                  Visit website
                  <ExternalLink size={12} className="ml-auto text-gray-400" />
                </a>
              )}

              {venue.bookingUrl && (
                <a
                  href={venue.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center rounded-xl"
                >
                  Book a table
                  <ExternalLink size={14} />
                </a>
              )}

              {venue.affiliateUrl && (
                <a
                  href={venue.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center rounded-xl"
                >
                  Book now
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Quick amenities */}
            {activeAmenities.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-charcoal mb-3">Quick summary</h3>
                <ul className="space-y-2">
                  {activeAmenities.map((a) => (
                    <li key={a.key} className="flex items-center gap-2 text-sm text-gray-700">
                      <span>{a.icon}</span>
                      <span>{a.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Breadcrumbs */}
            <nav className="text-xs text-gray-400 flex flex-wrap gap-1 items-center">
              <Link href="/" className="hover:text-lavender">Home</Link>
              <span>/</span>
              <Link href="/venues" className="hover:text-lavender">Venues</Link>
              {venue.area && (
                <>
                  <span>/</span>
                  <Link href={`/areas/${venue.area.slug}`} className="hover:text-lavender">{venue.area.name}</Link>
                </>
              )}
              <span>/</span>
              <span className="text-charcoal">{venue.name}</span>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
