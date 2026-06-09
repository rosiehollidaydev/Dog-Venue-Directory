"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getSession } from "./session";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return { error: "Invalid credentials" };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "Invalid credentials" };
  }

  const session = await getSession();
  session.isLoggedIn = true;
  session.adminId = admin.id;
  session.adminEmail = admin.email;
  session.adminName = admin.name ?? undefined;
  await session.save();

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }
  return session;
}

export async function createVenueAction(formData: FormData) {
  await requireAdmin();

  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    address: formData.get("address") as string,
    description: formData.get("description") as string,
    cityId: formData.get("cityId") as string,
    areaId: (formData.get("areaId") as string) || null,
    categoryId: formData.get("categoryId") as string,
    website: (formData.get("website") as string) || null,
    affiliateUrl: (formData.get("affiliateUrl") as string) || null,
    bookingUrl: (formData.get("bookingUrl") as string) || null,
    phone: (formData.get("phone") as string) || null,
    image: (formData.get("image") as string) || null,
    dogsInside: formData.get("dogsInside") === "on",
    waterBowls: formData.get("waterBowls") === "on",
    dogTreats: formData.get("dogTreats") === "on",
    outdoorSeating: formData.get("outdoorSeating") === "on",
    dogMenu: formData.get("dogMenu") === "on",
    overnightStays: formData.get("overnightStays") === "on",
    featured: formData.get("featured") === "on",
    verified: formData.get("verified") === "on",
    verificationStatus: (formData.get("verificationStatus") as string) || "unverified",
    sourceUrl: (formData.get("sourceUrl") as string) || null,
    metaTitle: (formData.get("metaTitle") as string) || null,
    metaDescription: (formData.get("metaDescription") as string) || null,
  };

  if (!data.name || !data.slug || !data.address || !data.description || !data.cityId || !data.categoryId) {
    return { error: "Required fields are missing" };
  }

  await prisma.venue.create({ data });
  revalidatePath("/admin/venues");
  revalidatePath("/venues");
  redirect("/admin/venues");
}

export async function updateVenueAction(id: string, formData: FormData) {
  await requireAdmin();

  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    address: formData.get("address") as string,
    description: formData.get("description") as string,
    cityId: formData.get("cityId") as string,
    areaId: (formData.get("areaId") as string) || null,
    categoryId: formData.get("categoryId") as string,
    website: (formData.get("website") as string) || null,
    affiliateUrl: (formData.get("affiliateUrl") as string) || null,
    bookingUrl: (formData.get("bookingUrl") as string) || null,
    phone: (formData.get("phone") as string) || null,
    image: (formData.get("image") as string) || null,
    dogsInside: formData.get("dogsInside") === "on",
    waterBowls: formData.get("waterBowls") === "on",
    dogTreats: formData.get("dogTreats") === "on",
    outdoorSeating: formData.get("outdoorSeating") === "on",
    dogMenu: formData.get("dogMenu") === "on",
    overnightStays: formData.get("overnightStays") === "on",
    featured: formData.get("featured") === "on",
    verified: formData.get("verified") === "on",
    verificationStatus: (formData.get("verificationStatus") as string) || "unverified",
    sourceUrl: (formData.get("sourceUrl") as string) || null,
    metaTitle: (formData.get("metaTitle") as string) || null,
    metaDescription: (formData.get("metaDescription") as string) || null,
  };

  await prisma.venue.update({ where: { id }, data });
  revalidatePath("/admin/venues");
  revalidatePath("/venues");
  redirect("/admin/venues");
}

export async function deleteVenueAction(id: string) {
  await requireAdmin();
  await prisma.venue.delete({ where: { id } });
  revalidatePath("/admin/venues");
  revalidatePath("/venues");
}

export async function createCityAction(formData: FormData) {
  await requireAdmin();
  await prisma.city.create({
    data: {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || null,
      metaTitle: (formData.get("metaTitle") as string) || null,
      metaDesc: (formData.get("metaDesc") as string) || null,
    },
  });
  revalidatePath("/admin/cities");
}

export async function deleteCityAction(id: string) {
  await requireAdmin();
  await prisma.city.delete({ where: { id } });
  revalidatePath("/admin/cities");
}

export async function createAreaAction(formData: FormData) {
  await requireAdmin();
  await prisma.area.create({
    data: {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      cityId: formData.get("cityId") as string,
    },
  });
  revalidatePath("/admin/areas");
}

export async function deleteAreaAction(id: string) {
  await requireAdmin();
  await prisma.area.delete({ where: { id } });
  revalidatePath("/admin/areas");
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  await prisma.category.create({
    data: {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || null,
      icon: (formData.get("icon") as string) || null,
    },
  });
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function updateReviewAction(id: string, approved: boolean) {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { approved } });
  revalidatePath("/admin/reviews");
}

export async function deleteReviewAction(id: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
}

export async function updateClaimAction(id: string, status: string) {
  await requireAdmin();
  await prisma.claimRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/claims");
}

export async function toggleFeaturedAction(id: string, featured: boolean) {
  await requireAdmin();
  await prisma.venue.update({ where: { id }, data: { featured } });
  revalidatePath("/admin/featured");
  revalidatePath("/venues");
}
