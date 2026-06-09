"use client";

import { useState } from "react";

interface City { id: string; name: string }
interface Area { id: string; name: string; cityId: string }
interface Category { id: string; name: string }

interface VenueFormProps {
  action: (formData: FormData) => void | Promise<void>;
  cities: City[];
  areas: Area[];
  categories: Category[];
  defaultValues?: {
    id?: string;
    name?: string;
    slug?: string;
    address?: string;
    description?: string;
    cityId?: string;
    areaId?: string;
    categoryId?: string;
    website?: string;
    affiliateUrl?: string;
    bookingUrl?: string;
    phone?: string;
    image?: string;
    dogsInside?: boolean;
    waterBowls?: boolean;
    dogTreats?: boolean;
    outdoorSeating?: boolean;
    dogMenu?: boolean;
    overnightStays?: boolean;
    featured?: boolean;
    verified?: boolean;
    verificationStatus?: string;
    sourceUrl?: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  submitLabel?: string;
}

export default function VenueForm({
  action,
  cities,
  areas,
  categories,
  defaultValues = {},
  submitLabel = "Save Venue",
}: VenueFormProps) {
  const [selectedCity, setSelectedCity] = useState(defaultValues.cityId || "");
  const filteredAreas = areas.filter((a) => a.cityId === selectedCity);

  const [slugValue, setSlugValue] = useState(defaultValues.slug || "");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  return (
    <form action={action} className="space-y-8">
      {/* Basic info */}
      <div className="card p-6">
        <h2 className="font-semibold text-charcoal mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Name *</label>
            <input
              name="name"
              required
              defaultValue={defaultValues.name}
              onChange={(e) => {
                if (!defaultValues.slug) setSlugValue(generateSlug(e.target.value));
              }}
              className="form-input"
              placeholder="e.g. The Tyne Bar"
            />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input
              name="slug"
              required
              value={slugValue}
              onChange={(e) => setSlugValue(e.target.value)}
              className="form-input"
              placeholder="the-tyne-bar"
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Address *</label>
            <input
              name="address"
              required
              defaultValue={defaultValues.address}
              className="form-input"
              placeholder="1 Broad Chare, Newcastle upon Tyne, NE1 3DQ"
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              required
              defaultValue={defaultValues.description}
              rows={4}
              className="form-input resize-none"
              placeholder="Describe this venue and why it's dog-friendly..."
            />
          </div>
        </div>
      </div>

      {/* Classification */}
      <div className="card p-6">
        <h2 className="font-semibold text-charcoal mb-5">Classification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">City *</label>
            <select
              name="cityId"
              required
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="form-input"
            >
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Area</label>
            <select name="areaId" defaultValue={defaultValues.areaId || ""} className="form-input">
              <option value="">Select area</option>
              {filteredAreas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Category *</label>
            <select name="categoryId" required defaultValue={defaultValues.categoryId || ""} className="form-input">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="card p-6">
        <h2 className="font-semibold text-charcoal mb-5">Contact & Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Phone</label>
            <input name="phone" defaultValue={defaultValues.phone || ""} className="form-input" placeholder="0191 000 0000" />
          </div>
          <div>
            <label className="form-label">Website URL</label>
            <input name="website" type="url" defaultValue={defaultValues.website || ""} className="form-input" placeholder="https://example.com" />
          </div>
          <div>
            <label className="form-label">Booking URL</label>
            <input name="bookingUrl" type="url" defaultValue={defaultValues.bookingUrl || ""} className="form-input" placeholder="https://opentable.com/..." />
          </div>
          <div>
            <label className="form-label">Affiliate URL</label>
            <input name="affiliateUrl" type="url" defaultValue={defaultValues.affiliateUrl || ""} className="form-input" placeholder="https://booking.com/..." />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Image URL</label>
            <input name="image" type="url" defaultValue={defaultValues.image || ""} className="form-input" placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* Dog amenities */}
      <div className="card p-6">
        <h2 className="font-semibold text-charcoal mb-5">Dog-Friendly Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { name: "dogsInside", label: "🏠 Dogs Inside", checked: defaultValues.dogsInside },
            { name: "waterBowls", label: "💧 Water Bowls", checked: defaultValues.waterBowls },
            { name: "dogTreats", label: "🦴 Dog Treats", checked: defaultValues.dogTreats },
            { name: "outdoorSeating", label: "☀️ Outdoor Seating", checked: defaultValues.outdoorSeating },
            { name: "dogMenu", label: "🍽️ Dog Menu", checked: defaultValues.dogMenu },
            { name: "overnightStays", label: "🛏️ Overnight Stays", checked: defaultValues.overnightStays },
          ].map(({ name, label, checked }) => (
            <label key={name} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-lavender/40 cursor-pointer transition-colors">
              <input type="checkbox" name={name} defaultChecked={checked} className="rounded text-lavender focus:ring-lavender" />
              <span className="text-sm font-medium text-charcoal">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="card p-6">
        <h2 className="font-semibold text-charcoal mb-5">Status & Verification</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            {[
              { name: "featured", label: "⭐ Featured listing", checked: defaultValues.featured },
              { name: "verified", label: "✓ Verified", checked: defaultValues.verified },
            ].map(({ name, label, checked }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name={name} defaultChecked={checked} className="rounded text-lavender focus:ring-lavender" />
                <span className="text-sm font-medium text-charcoal">{label}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="form-label">Verification Status</label>
            <select name="verificationStatus" defaultValue={defaultValues.verificationStatus || "unverified"} className="form-input">
              <option value="unverified">Unverified</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="form-label">Source URL</label>
            <input name="sourceUrl" type="url" defaultValue={defaultValues.sourceUrl || ""} className="form-input" placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="card p-6">
        <h2 className="font-semibold text-charcoal mb-5">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className="form-label">Meta Title</label>
            <input name="metaTitle" defaultValue={defaultValues.metaTitle || ""} className="form-input" placeholder="Leave blank to auto-generate" maxLength={60} />
          </div>
          <div>
            <label className="form-label">Meta Description</label>
            <textarea name="metaDescription" defaultValue={defaultValues.metaDescription || ""} rows={2} className="form-input resize-none" placeholder="Leave blank to auto-generate" maxLength={160} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary px-8 py-3 rounded-xl text-base">
          {submitLabel}
        </button>
        <a href="/admin/venues" className="btn-ghost px-8 py-3 rounded-xl text-base">
          Cancel
        </a>
      </div>
    </form>
  );
}
