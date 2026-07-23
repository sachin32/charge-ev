import Link from "next/link";
import Logo from "@/components/Logo";

const menuItems = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Locate", href: "/#locate" },
  { label: "Goto", href: "/goto" },
  { label: "Help", href: "/#help" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur backdrop-saturate-150 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-50 overflow-hidden">
            <Link href="/">
              <span className="text-xl font-bold text-slate-900"><Logo /></span>
            </Link>
          </div>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <span className="text-sm font-medium text-slate-700 transition hover:text-slate-950">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
