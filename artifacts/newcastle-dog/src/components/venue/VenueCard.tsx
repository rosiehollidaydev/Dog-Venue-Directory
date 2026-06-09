import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    slug: string;
    address: string;
    description: string;
    image: string | null;
    featured: boolean;
    verified: boolean;
    dogsInside: boolean;
    waterBowls: boolean;
    dogTreats: boolean;
    outdoorSeating: boolean;
    dogMenu: boolean;
    overnightStays: boolean;
    category: { name: string; slug: string };
    area?: { name: string; slug: string } | null;
    city: { name: string; slug: string };
  };
  className?: string;
}

const amenityIcons: Record<string, { label: string; icon: string }> = {
  dogsInside: { label: "Dogs Inside", icon: "🏠" },
  waterBowls: { label: "Water Bowls", icon: "💧" },
  dogTreats: { label: "Dog Treats", icon: "🦴" },
  outdoorSeating: { label: "Outdoor Seating", icon: "☀️" },
  dogMenu: { label: "Dog Menu", icon: "🍽️" },
  overnightStays: { label: "Overnight Stays", icon: "🛏️" },
};

export default function VenueCard({ venue, className }: VenueCardProps) {
  const amenities = Object.entries(amenityIcons)
    .filter(([key]) => venue[key as keyof typeof venue] === true)
    .slice(0, 3);

  return (
    <Link href={`/venues/${venue.slug}`} className={cn("card group block", className)}>
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-lavender/20 to-ice-blue/20 dark:from-purple-mid/30 dark:to-purple-deep overflow-hidden">
        {venue.image ? (
          <Image
            src={venue.image}
            alt={venue.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-30">🐾</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge bg-white/90 text-charcoal backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full">
            {venue.category.name}
          </span>
          {venue.featured && (
            <span className="badge bg-lavender text-white text-xs font-medium px-2.5 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>

        {venue.verified && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 bg-neon-mint text-charcoal text-xs font-semibold px-2.5 py-1 rounded-full">
              <CheckCircle size={11} />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-charcoal dark:text-purple-soft text-base mb-1 group-hover:text-lavender transition-colors line-clamp-1">
          {venue.name}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 dark:text-purple-pale/60 text-xs mb-2">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">
            {venue.area ? `${venue.area.name}, ` : ""}{venue.city.name}
          </span>
        </div>

        <p className="text-gray-600 dark:text-purple-pale/70 text-sm line-clamp-2 mb-3">
          {venue.description}
        </p>

        {/* Amenity chips */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {amenities.map(([key, { label, icon }]) => (
              <span key={key} className="amenity-tag text-xs px-2 py-1">
                {icon} {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
