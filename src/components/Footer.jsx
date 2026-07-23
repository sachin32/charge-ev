import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="mx-auto max-w-7xl px-4 py-12 text-sm text-slate-600 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto]">
          <div className="space-y-4">
            <div className="text-slate-900 font-semibold w-78 h-28"><Logo/></div>
            <p className="max-w-md text-sm text-slate-600">
              Your companion for finding the nearest electric vehicle charging stations, planning routes, and navigating with confidence.
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Get in touch</p>
            <div className="space-y-2 text-sm text-slate-600">
              <div>Email: support@charge-ev.in</div>
              <div>Phone: +91 7860086395</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-slate-900 font-semibold">Quick links</div>
            <div className="flex flex-col gap-2 text-slate-600">
              <Link href="/" className="transition hover:text-slate-900">Home</Link>
              <Link href="/goto" className="transition hover:text-slate-900">Goto</Link>
              <Link href="/#about" className="transition hover:text-slate-900">About</Link>
              <Link href="/#locate" className="transition hover:text-slate-900">Locate</Link>
            </div>
          </div>

          {/* <div className="space-y-4">
            <div className="text-slate-900 font-semibold">Follow us</div>
            <div className="flex flex-wrap gap-3 text-slate-600">
              <a href="#" className="transition hover:text-slate-900">Twitter</a>
              <a href="#" className="transition hover:text-slate-900">LinkedIn</a>
              <a href="#" className="transition hover:text-slate-900">GitHub</a>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
