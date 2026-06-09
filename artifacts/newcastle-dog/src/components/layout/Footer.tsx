import Link from "next/link";

const categories = [
  { href: "/pubs", label: "Pubs" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/cafes", label: "Cafés" },
  { href: "/hotels", label: "Hotels" },
];

const areas = [
  { href: "/areas/quayside", label: "Quayside" },
  { href: "/areas/jesmond", label: "Jesmond" },
  { href: "/areas/ouseburn", label: "Ouseburn" },
  { href: "/areas/gosforth", label: "Gosforth" },
  { href: "/areas/heaton", label: "Heaton" },
  { href: "/areas/tynemouth", label: "Tynemouth" },
];

export default function Footer() {
  return (
    <footer className="bg-purple-night text-white mt-20" style={{ background: "linear-gradient(135deg, #0A0518 0%, #160B3D 100%)" }}>
      <div className="page-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐾</span>
              <div className="leading-none">
                <span className="font-bold text-white text-lg">Newcastle</span>
                <span className="font-bold text-lavender text-lg">.dog</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              The best dog-friendly venues in Newcastle upon Tyne. Find pubs, restaurants, cafés and hotels that welcome you and your four-legged friend.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-white/60 hover:text-neon-mint text-sm transition-colors"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Areas
            </h3>
            <ul className="space-y-2">
              {areas.map((a) => (
                <li key={a.href}>
                  <Link
                    href={a.href}
                    className="text-white/60 hover:text-neon-mint text-sm transition-colors"
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Info
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/venues" className="text-white/60 hover:text-neon-mint text-sm transition-colors">
                  All Venues
                </Link>
              </li>
              <li>
                <Link href="/cities/newcastle" className="text-white/60 hover:text-neon-mint text-sm transition-colors">
                  Newcastle
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Newcastle.dog — All rights reserved
          </p>
          <p className="text-white/40 text-xs">
            Made with 🐾 for dog lovers in Newcastle
          </p>
        </div>
      </div>
    </footer>
  );
}
