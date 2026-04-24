import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[var(--color-cream-200)] bg-[var(--color-cream-50)]/90 backdrop-blur sticky top-0 z-40">
      <div className="container-v flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--color-navy-800)]"
            style={{ fontStyle: "italic" }}
          >
            Vocatio
          </span>
          <span className="hidden sm:inline text-[0.7rem] tracking-[0.2em] uppercase text-[var(--color-gold-600)]">
            Travel
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/#destinations" className="hover:text-[var(--color-gold-600)]">
            Destinations
          </Link>
          <Link href="/#groups" className="hover:text-[var(--color-gold-600)]">
            Groups we serve
          </Link>
          <Link href="/#how" className="hover:text-[var(--color-gold-600)]">
            How it works
          </Link>
          <Link href="/trip/rome-assisi-pilgrimage-demo" className="hover:text-[var(--color-gold-600)]">
            Sample itinerary
          </Link>
        </nav>
        <Link href="/plan" className="btn btn-gold">
          Plan your journey
        </Link>
      </div>
    </header>
  );
}
