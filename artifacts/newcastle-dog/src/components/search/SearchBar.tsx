"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  categories: FilterOption[];
  areas: FilterOption[];
  cities: FilterOption[];
}

export default function SearchBar({ categories, areas, cities }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: query });
  };

  const clearFilters = () => {
    setQuery("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="w-full">
      {/* Search input */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dog-friendly venues..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-lavender focus:ring-1 focus:ring-lavender transition-colors"
          />
        </div>
        <button type="submit" className="btn-primary px-5 py-3 rounded-xl">
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border-2 transition-colors ${
            showFilters
              ? "border-lavender bg-lavender/10 text-lavender"
              : "border-gray-200 text-gray-500 hover:border-lavender hover:text-lavender"
          }`}
        >
          <SlidersHorizontal size={18} />
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="p-3 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
          <div>
            <label className="form-label">Category</label>
            <select
              value={searchParams.get("category") || ""}
              onChange={(e) => updateParams({ category: e.target.value })}
              className="form-input"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Area</label>
            <select
              value={searchParams.get("area") || ""}
              onChange={(e) => updateParams({ area: e.target.value })}
              className="form-input"
            >
              <option value="">All areas</option>
              {areas.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">City</label>
            <select
              value={searchParams.get("city") || ""}
              onChange={(e) => updateParams({ city: e.target.value })}
              className="form-input"
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-3">
            <label className="form-label">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "dogsInside", label: "🏠 Dogs Inside" },
                { key: "waterBowls", label: "💧 Water Bowls" },
                { key: "dogTreats", label: "🦴 Dog Treats" },
                { key: "outdoorSeating", label: "☀️ Outdoor Seating" },
                { key: "dogMenu", label: "🍽️ Dog Menu" },
                { key: "overnightStays", label: "🛏️ Overnight Stays" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    updateParams({
                      [key]: searchParams.get(key) === "true" ? "" : "true",
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                    searchParams.get(key) === "true"
                      ? "border-mint bg-mint/20 text-charcoal"
                      : "border-gray-200 bg-white text-gray-600 hover:border-mint"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="mt-2 text-sm text-lavender animate-pulse">Searching...</div>
      )}
    </div>
  );
}
