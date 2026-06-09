import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const areas = [
  { name: "Quayside", slug: "quayside" },
  { name: "Jesmond", slug: "jesmond" },
  { name: "Ouseburn", slug: "ouseburn" },
  { name: "Gosforth", slug: "gosforth" },
  { name: "Heaton", slug: "heaton" },
  { name: "City Centre", slug: "city-centre" },
  { name: "Tynemouth", slug: "tynemouth" },
];

const categories = [
  { name: "Pubs", slug: "pubs", icon: "🍺", description: "Dog-friendly pubs in Newcastle" },
  { name: "Restaurants", slug: "restaurants", icon: "🍽️", description: "Dog-friendly restaurants in Newcastle" },
  { name: "Cafés", slug: "cafes", icon: "☕", description: "Dog-friendly cafés in Newcastle" },
  { name: "Hotels", slug: "hotels", icon: "🛏️", description: "Dog-friendly hotels in Newcastle" },
];

// ── The 6 named venues ──────────────────────────────────────────────────────
const namedVenues = [
  {
    name: "The Tyne Bar",
    slug: "the-tyne-bar",
    area: "ouseburn",
    category: "pubs",
    address: "1 Maling St, Ouseburn, Newcastle upon Tyne, NE6 1LP",
    description: "A beloved Ouseburn institution, The Tyne Bar sits right on the river with a sun-soaked terrace and a famously warm welcome for dogs. Known for its rotating craft ales, live music and laid-back atmosphere, it's one of Newcastle's most characterful pubs. Dogs get their own water bowl and the staff always have a treat on hand.",
    website: "https://thetynebar.com",
    phone: "0191 265 2550",
    dogsInside: true, waterBowls: true, dogTreats: true, outdoorSeating: true, dogMenu: false, overnightStays: false,
  },
  {
    name: "The Broad Chare",
    slug: "the-broad-chare",
    area: "quayside",
    category: "pubs",
    address: "25 Broad Chare, Quayside, Newcastle upon Tyne, NE1 3DQ",
    description: "A stunning Newcastle pub with serious food credentials, The Broad Chare on the Quayside is dog-friendly throughout its ground floor. With an excellent selection of cask ales and a menu focused on British pub classics, it's a refined but relaxed spot where well-behaved dogs are genuinely welcome alongside their owners.",
    website: "https://thebroadchare.co.uk",
    phone: "0191 211 2144",
    dogsInside: true, waterBowls: true, dogTreats: false, outdoorSeating: true, dogMenu: false, overnightStays: false,
  },
  {
    name: "Hotel du Vin Newcastle",
    slug: "hotel-du-vin-newcastle",
    area: "city-centre",
    category: "hotels",
    address: "Allan House, City Rd, Newcastle upon Tyne, NE1 2BE",
    description: "Hotel du Vin Newcastle is a boutique hotel that truly understands the bond between people and their dogs. Housed in a stunning red-brick building near the Quayside, dogs are welcomed with their own bed, bowl and treats. The cosy bar is dog-friendly and the staff are genuinely dog-loving — expect a warm welcome from the moment you arrive.",
    website: "https://www.hotelduvin.com/locations/newcastle",
    phone: "0191 229 2200",
    dogsInside: true, waterBowls: true, dogTreats: true, outdoorSeating: true, dogMenu: false, overnightStays: true,
  },
  {
    name: "Pizza Punks",
    slug: "pizza-punks",
    area: "city-centre",
    category: "restaurants",
    address: "Union Buildings, 16-18 High Bridge, Newcastle upon Tyne, NE1 1EN",
    description: "Pizza Punks is Newcastle's punk-spirited, build-your-own-pizza restaurant in the heart of the city. Dogs are welcome on the heated outdoor terrace where you can customise your pizza with unlimited toppings. The vibe is loud, fun and unpretentious — a great spot for dog owners who want good food without stuffiness.",
    website: "https://pizzapunks.co.uk",
    phone: "0191 230 3737",
    dogsInside: false, waterBowls: true, dogTreats: false, outdoorSeating: true, dogMenu: false, overnightStays: false,
  },
  {
    name: "The Brandling Villa",
    slug: "the-brandling-villa",
    area: "jesmond",
    category: "pubs",
    address: "Haddricks Mill Rd, South Gosforth, Newcastle upon Tyne, NE3 1QL",
    description: "A Jesmond favourite with a huge beer garden and a genuinely dog-friendly atmosphere throughout. The Brandling Villa is a community pub with a heart — great food, excellent ales and staff who know your dog by name before long. The garden is perfect for warm days and there's always water available for thirsty hounds.",
    website: "https://www.thebrandlingvilla.co.uk",
    phone: "0191 284 0490",
    dogsInside: true, waterBowls: true, dogTreats: true, outdoorSeating: true, dogMenu: true, overnightStays: false,
  },
  {
    name: "Jesmond Dene House",
    slug: "jesmond-dene-house",
    area: "jesmond",
    category: "hotels",
    address: "Jesmond Dene Rd, Newcastle upon Tyne, NE2 2EY",
    description: "Jesmond Dene House is Newcastle's finest boutique hotel, nestled in a tranquil woodland setting. Dogs are very welcome and receive a proper five-star experience — their own bed, ceramic bowls and a dog-sitting service available on request. The hotel sits adjacent to the beautiful Jesmond Dene park, making it the perfect base for long forest walks.",
    website: "https://www.jesmonddenehouse.co.uk",
    phone: "0191 212 3000",
    dogsInside: true, waterBowls: true, dogTreats: true, outdoorSeating: true, dogMenu: true, overnightStays: true,
  },
];

// ── Venue name parts for generation ─────────────────────────────────────────
const pubPrefixes = ["The", "The Old", "The", "The New", "The"];
const pubNames = [
  "Crown", "Anchor", "Ship", "Stag", "Fox", "Falcon", "Lion", "Swan", "Eagle",
  "Wheatsheaf", "Plough", "Lamb", "Duke", "King's Arms", "Queen's Head",
  "Tap Room", "Cask & Bottle", "Ale House", "Vaults", "Cellar",
  "Greyhound", "Pointer", "Spaniel", "Retriever", "Terrier",
  "Ouseburn Arms", "Tyne View", "River Watch", "Coal Drops", "Keelman",
  "Biscuit Factory Bar", "Tanners", "Free Trade", "Cumberland Arms", "Cluny",
  "Chillingham Arms", "Millstone", "Carpenter's Arms", "Nag's Head",
];

const cafeNames = [
  "Bean & Paw Café", "The Dog House Café", "Paws & Coffee", "Muddy Paws Café",
  "Tail Waggers", "The Biscuit Tin", "Brew & Bark", "Good Boy Coffee",
  "The Snout & Cup", "Pawsome Coffee", "Fetch & Brew", "The Leash",
  "Wags & Brews", "Hound About Town Coffee", "The Kennel Café",
  "Four Paws Coffee", "The Coffee Collie", "Barked Goods", "Sit & Stay Café",
  "The Labrador Coffee House", "The Spaniel Spot", "Biscuit & Brew",
];

const restaurantNames = [
  "The Dog & Diner", "Paws & Plates", "Wag & Fork", "The Hound's Kitchen",
  "Bark & Bite", "Leash & Eat", "The Retriever Restaurant", "Good Dog Dining",
  "Paw Prints Kitchen", "The Spaniel Table", "Fetch Kitchen", "Hound's Table",
  "The Pointer Bistro", "Dog Days Dining", "Tail & Fork", "The Kennel Kitchen",
  "Canine & Dine", "The Dog Bowl Restaurant", "Terrace & Terrier",
];

const hotelNames = [
  "The Dog-Friendly Inn", "Paws Welcome Hotel", "The Hound Hotel",
  "Bark & Bed", "The Wagging Tail Inn", "Stay & Play Hotel",
  "The Retriever Arms Hotel", "Dog Days Hotel", "The Spaniel Stay",
  "Paw Prints Hotel", "The Kennel Suite", "Wag Inn",
];

const streetNames = [
  "High Street", "Church Street", "Park Road", "Victoria Terrace",
  "Northumberland Street", "Pilgrim Street", "Clayton Street", "Grey Street",
  "Dean Street", "Sandhill", "The Side", "Castle Garth", "St Andrew's Street",
  "Westgate Road", "Newgate Street", "Percy Street", "Market Street",
  "Grainger Street", "Bigg Market", "The Close", "Quayside", "Broad Chare",
  "City Road", "Shields Road", "Chillingham Road", "Osborne Road",
  "Jesmond Road", "Salters Road", "Gosforth High Street", "Station Road",
  "Front Street", "King Edward Road", "Manor House Road", "Hawthorn Road",
];

const postcodes: Record<string, string[]> = {
  quayside: ["NE1 3DQ", "NE1 3AF", "NE1 2BE", "NE1 3QE"],
  jesmond: ["NE2 1HJ", "NE2 2EY", "NE2 3AY", "NE2 4DX"],
  ouseburn: ["NE1 2DA", "NE6 1LP", "NE6 1AU", "NE6 2QE"],
  gosforth: ["NE3 1AB", "NE3 2QA", "NE3 3HH", "NE3 4RJ"],
  heaton: ["NE6 5LP", "NE6 1AN", "NE6 5NY", "NE6 5EA"],
  "city-centre": ["NE1 1EN", "NE1 5BJ", "NE1 7RU", "NE1 4EB"],
  tynemouth: ["NE30 1HE", "NE30 4AA", "NE30 4BX", "NE30 1JH"],
};

const pubDescriptions = [
  "A cracking neighbourhood pub that's been welcoming dogs and their owners for years. Excellent real ales, hearty food and a proper community atmosphere make this a firm favourite with the local dog-walking crowd. Water bowls are always filled and staff love meeting new four-legged customers.",
  "This traditional pub sits at the heart of the community with a warm welcome for all — including the canine variety. The outdoor terrace fills up fast on sunny days with dogs of all shapes and sizes. Inside, well-behaved hounds are equally at home by the bar.",
  "A proper local with bags of character and a genuine love of dogs. The bar staff know many regulars by name — and their dogs too. Expect a decent pint, honest pub grub and a relaxed atmosphere where no one minds a wagging tail.",
  "One of Newcastle's great dog-friendly pubs with a fantastic beer selection and a sun-trap garden. The landlord has two dogs of his own so the welcome couldn't be warmer. Dog treats are kept behind the bar and water bowls are refreshed regularly.",
  "This characterful pub has been dog-friendly since day one. Locals bring their dogs in for Sunday lunch and the evening crowd is always a mix of people and pooches. Great rotating craft ales and a kitchen that turns out proper food.",
  "A beautifully restored Victorian pub with high ceilings, warm lighting and a genuine love of dogs. The covered outdoor area means dogs and owners can enjoy a drink in most weathers. Excellent ale selection and a food menu worth lingering over.",
  "With exposed brick, reclaimed wood and a roaring fire in winter, this pub is as welcoming to dogs as it is to people. The garden is enclosed and secure, perfect for letting excited dogs socialise safely while you enjoy a pint.",
  "A free house with a fantastic range of local ales and a strong reputation for good food. Dogs are welcome in the bar and garden areas, with water bowls and treats always available. The staff are genuinely enthusiastic about their canine visitors.",
];

const cafeDescriptions = [
  "A dog-loving café that's become a firm fixture on the local dog-walker route. The outdoor seating fills up with dogs of all sizes from the moment it opens. Great coffee, homemade cakes and a proper welcome for your four-legged friend — including a treat from the counter.",
  "This independent café wears its dog-friendly credentials proudly. The menu includes a dedicated dog biscuit selection alongside excellent specialty coffee and homemade bakes. A water bowl is always waiting outside and dogs are welcome inside too.",
  "A relaxed, community-minded café that happens to make excellent coffee and has an unconditional love of dogs. The sunny courtyard is the spot to be on a nice day — expect to share your bench with someone else's spaniel.",
  "Newcastle's most dog-obsessed café, where the four-legged customers are treated just as well as the human ones. Dog puppuccinos, homemade biscuits and a shaded garden make this a must-visit for any dog owner in the area.",
  "A bright, welcoming café that serves specialty coffee and genuinely good food in a relaxed setting. Dogs are always welcome and the team genuinely loves meeting new canine customers. The enclosed garden is perfect for a relaxed coffee stop on a dog walk.",
];

const restaurantDescriptions = [
  "A brilliant dog-friendly restaurant with a covered outdoor terrace where dogs are very welcome. The menu focuses on locally sourced ingredients and seasonal dishes — proper food in a relaxed setting. Water is always on hand for dogs and the staff are genuinely warm towards canine diners.",
  "This independent restaurant has built a loyal following among Newcastle's dog-owning community. The outdoor terrace is heated and sheltered, meaning dogs and their owners can dine comfortably year round. The food is excellent — confident cooking with a focus on quality ingredients.",
  "With a large garden and a genuinely dog-friendly policy, this restaurant is a go-to for owners who want a proper meal without leaving their dog at home. The kitchen turns out crowd-pleasing food and the service is warm and unhurried.",
  "A stylish but relaxed restaurant that welcomes dogs with open arms on the terrace. The menu is creative and well-executed, with something for everyone. Dogs get a dedicated water bowl and the staff always have a treat hidden somewhere.",
];

const hotelDescriptions = [
  "A stylish and genuinely dog-friendly hotel that provides everything your four-legged companion needs for a comfortable stay. Dog beds, bowls and a welcome treat are provided on arrival. The hotel is perfectly positioned for exploring Newcastle with your dog, and the staff are always happy to share local dog-walking routes.",
  "This boutique hotel takes its dog-friendly credentials seriously — dogs are provided with their own bed, bowls and treats, and are welcome throughout the hotel including the bar and lounge. The location is ideal for walks and the team will happily recommend the best local routes.",
  "A welcoming hotel that understands the importance of travelling with your dog. The team here genuinely loves animals and it shows in every detail — from the dog beds in the rooms to the bowl of water in reception. Perfectly placed for long walks and city exploration.",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomBool(probability = 0.5): boolean {
  return Math.random() < probability;
}

function generateVenueData(
  index: number,
  areaSlug: string,
  categorySlug: string,
  usedSlugs: Set<string>
): {
  name: string; slug: string; address: string; description: string;
  dogsInside: boolean; waterBowls: boolean; dogTreats: boolean;
  outdoorSeating: boolean; dogMenu: boolean; overnightStays: boolean;
} {
  let name = "";
  let description = "";

  if (categorySlug === "pubs") {
    name = `${getRandomItem(pubPrefixes)} ${getRandomItem(pubNames)}`;
    description = getRandomItem(pubDescriptions);
  } else if (categorySlug === "cafes") {
    name = getRandomItem(cafeNames);
    description = getRandomItem(cafeDescriptions);
  } else if (categorySlug === "restaurants") {
    name = getRandomItem(restaurantNames);
    description = getRandomItem(restaurantDescriptions);
  } else {
    name = getRandomItem(hotelNames);
    description = getRandomItem(hotelDescriptions);
  }

  // Ensure unique name
  const baseName = name;
  let counter = 1;
  while (usedSlugs.has(slugify(name))) {
    name = `${baseName} ${counter++}`;
  }

  const slug = slugify(name);
  usedSlugs.add(slug);

  const streetNum = Math.floor(Math.random() * 120) + 1;
  const street = getRandomItem(streetNames);
  const areaPostcodes = postcodes[areaSlug] || ["NE1 1AA"];
  const postcode = getRandomItem(areaPostcodes);
  const address = `${streetNum} ${street}, Newcastle upon Tyne, ${postcode}`;

  const isHotel = categorySlug === "hotels";
  const isPub = categorySlug === "pubs";

  return {
    name,
    slug,
    address,
    description,
    dogsInside: getRandomBool(isPub ? 0.85 : isHotel ? 1 : 0.4),
    waterBowls: getRandomBool(0.9),
    dogTreats: getRandomBool(isPub ? 0.7 : 0.5),
    outdoorSeating: getRandomBool(0.8),
    dogMenu: getRandomBool(isPub ? 0.3 : isHotel ? 0.5 : 0.2),
    overnightStays: isHotel ? true : false,
  };
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Distribution: 100 generated + 6 named = 106 total
// Per area: Quayside 14, Jesmond 15, Ouseburn 14, Gosforth 15, Heaton 14, City Centre 14, Tynemouth 14
const areaDistributions: Array<{ area: string; counts: Array<{ cat: string; n: number }> }> = [
  { area: "quayside", counts: [{ cat: "pubs", n: 6 }, { cat: "restaurants", n: 4 }, { cat: "cafes", n: 3 }, { cat: "hotels", n: 1 }] },
  { area: "jesmond", counts: [{ cat: "pubs", n: 6 }, { cat: "restaurants", n: 4 }, { cat: "cafes", n: 4 }, { cat: "hotels", n: 1 }] },
  { area: "ouseburn", counts: [{ cat: "pubs", n: 6 }, { cat: "restaurants", n: 3 }, { cat: "cafes", n: 4 }, { cat: "hotels", n: 1 }] },
  { area: "gosforth", counts: [{ cat: "pubs", n: 7 }, { cat: "restaurants", n: 4 }, { cat: "cafes", n: 3 }, { cat: "hotels", n: 1 }] },
  { area: "heaton", counts: [{ cat: "pubs", n: 6 }, { cat: "restaurants", n: 3 }, { cat: "cafes", n: 4 }, { cat: "hotels", n: 1 }] },
  { area: "city-centre", counts: [{ cat: "pubs", n: 5 }, { cat: "restaurants", n: 5 }, { cat: "cafes", n: 3 }, { cat: "hotels", n: 1 }] },
  { area: "tynemouth", counts: [{ cat: "pubs", n: 6 }, { cat: "restaurants", n: 3 }, { cat: "cafes", n: 4 }, { cat: "hotels", n: 1 }] },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clean up
  await prisma.venueAmenity.deleteMany();
  await prisma.review.deleteMany();
  await prisma.claimRequest.deleteMany();
  await prisma.affiliateLink.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.area.deleteMany();
  await prisma.category.deleteMany();
  await prisma.city.deleteMany();
  await prisma.admin.deleteMany();

  console.log("✓ Cleaned existing data");

  // City
  const city = await prisma.city.create({
    data: {
      name: "Newcastle upon Tyne",
      slug: "newcastle",
      description: "Newcastle upon Tyne is a vibrant city in the North East of England with a thriving dog-friendly culture. From the Quayside to Jesmond Dene, there are hundreds of venues welcoming dogs and their owners.",
      metaTitle: "Dog-Friendly Newcastle upon Tyne",
      metaDesc: "Discover the best dog-friendly pubs, restaurants, cafés and hotels in Newcastle upon Tyne.",
    },
  });
  console.log("✓ Created city: Newcastle");

  // Areas
  const areaRecords: Record<string, { id: string }> = {};
  for (const area of areas) {
    const record = await prisma.area.create({
      data: { name: area.name, slug: area.slug, cityId: city.id },
    });
    areaRecords[area.slug] = record;
  }
  console.log(`✓ Created ${areas.length} areas`);

  // Categories
  const categoryRecords: Record<string, { id: string }> = {};
  for (const cat of categories) {
    const record = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description },
    });
    categoryRecords[cat.slug] = record;
  }
  console.log(`✓ Created ${categories.length} categories`);

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.admin.create({
    data: {
      email: "admin@newcastle.dog",
      passwordHash,
      name: "Admin",
    },
  });
  console.log("✓ Created admin user: admin@newcastle.dog / admin123");

  // Named venues
  let venueCount = 0;
  for (const v of namedVenues) {
    await prisma.venue.create({
      data: {
        name: v.name,
        slug: v.slug,
        address: v.address,
        description: v.description,
        website: v.website || null,
        phone: v.phone || null,
        cityId: city.id,
        areaId: areaRecords[v.area]?.id || null,
        categoryId: categoryRecords[v.category].id,
        dogsInside: v.dogsInside,
        waterBowls: v.waterBowls,
        dogTreats: v.dogTreats,
        outdoorSeating: v.outdoorSeating,
        dogMenu: v.dogMenu,
        overnightStays: v.overnightStays,
        verified: false,
        verificationStatus: "unverified",
        featured: ["the-tyne-bar", "jesmond-dene-house", "the-brandling-villa"].includes(v.slug),
      },
    });
    venueCount++;
  }
  console.log(`✓ Created ${venueCount} named venues`);

  // Generated venues
  const usedSlugs = new Set(namedVenues.map((v) => v.slug));
  let genCount = 0;

  for (const dist of areaDistributions) {
    for (const { cat, n } of dist.counts) {
      for (let i = 0; i < n; i++) {
        const data = generateVenueData(genCount, dist.area, cat, usedSlugs);
        await prisma.venue.create({
          data: {
            name: data.name,
            slug: data.slug,
            address: data.address,
            description: data.description,
            cityId: city.id,
            areaId: areaRecords[dist.area]?.id || null,
            categoryId: categoryRecords[cat].id,
            dogsInside: data.dogsInside,
            waterBowls: data.waterBowls,
            dogTreats: data.dogTreats,
            outdoorSeating: data.outdoorSeating,
            dogMenu: data.dogMenu,
            overnightStays: data.overnightStays,
            verified: false,
            verificationStatus: "unverified",
            featured: false,
          },
        });
        genCount++;
      }
    }
  }

  console.log(`✓ Created ${genCount} generated venues`);
  console.log(`\n🎉 Seed complete! Total venues: ${venueCount + genCount}`);
  console.log("\nAdmin credentials:");
  console.log("  Email:    admin@newcastle.dog");
  console.log("  Password: admin123");
  console.log("\nChange these credentials after first login!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
