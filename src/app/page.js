"use client";

import { useState } from "react";
import LocationReader from "@/components/LocationReader";
import ChargerList from "@/components/ChargerList";
import { useAppStore } from "@/store/useAppStore";
import Map from "@/components/Map";

export default function Home() {
  const location = useAppStore((state) => state.location);
  const selectedState = useAppStore((state) => state.selectedState);
  const selectedCity = useAppStore((state) => state.selectedCity);
  const [filteredChargers, setFilteredChargers] = useState([]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState("");

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactStatus("");
    if (!contactName || !contactEmail || !contactMessage) {
      setContactStatus("Please fill all fields.");
      return;
    }
    const subject = `Contact from ${contactName}`;
    const body = encodeURIComponent(`Name: ${contactName}\nEmail: ${contactEmail}\n\n${contactMessage}`);
    const mailto = `mailto:support@charge-ev.example?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.open(mailto);
    setContactStatus("Opened mail client.");
  };

  return (
    <div className="min-h-screen font-sans bg-[#F8FAFC] text-slate-900">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_35px_120px_-70px_rgba(15,23,42,0.8)]">
          <div className="relative grid gap-8 px-6 py-16 md:grid-cols-[1.5fr_1fr] md:px-12 md:py-20">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-teal-500/15 px-4 py-1.5 text-sm font-semibold text-teal-300 ring-1 ring-teal-300/20">EV charging made easy</span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                Find nearby charging stations fast, plan routes by state, city, and location.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Charge EV helps you discover the best charging points, get directions, and stay powered on the road. Search by state, city, or use the locator tool to jump straight
                to your destination.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#locate"
                  className="inline-flex items-center justify-center rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400"
                >
                  Locate charger
                </a>
                <a
                  href="#help"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-white/15"
                >
                  Learn more
                </a>
              </div>
            </div>

            <div className="relative isolate rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-8 ring-1 ring-white/10">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-teal-500/30 to-transparent blur-3xl" />
              <div className="relative rounded-[1.75rem] border border-slate-700/60 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/40">
                <h2 className="text-lg font-semibold text-white">Your next charge is nearby</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">Browse stations by region, compare availability, and get directions from your current location.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/90 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase tracking-[0.2em] text-teal-300">State</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{selectedState || (location ? "Detected automatically" : "Waiting for location")}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/90 p-4 ring-1 ring-white/10">
                    <p className="text-xs uppercase tracking-[0.2em] text-teal-300">City</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{selectedCity || (location ? "Detected automatically" : "Waiting for location")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       
         <section>
            <LocationReader />
          </section>

        <section>
          <div id="locate" className="grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm lg:grid-cols-[0.4fr_1fr] h-[800px] overflow-hidden">
            <div className="flex h-full min-h-0 flex-col">
              <ChargerList onFilteredChargersChange={setFilteredChargers} />
            </div>
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-slate-950/5">
              <div className="flex-1 min-h-0">
                <Map location={location} chargers={filteredChargers} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div id="about" className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">About Charge EV</h2>
            <p className="mt-3 text-sm text-slate-600">
              Charge EV helps drivers discover nearby public EV charging stations, compare connector types, and get directions from their current location.
            </p>
            <p className="mt-3 text-sm text-slate-600">Our mission is to make charging simple and accessible for everyone on the road.</p>
          </div>
        </section>

        <section>
          <div id="contact" className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Contact Us</h2>
            <p className="mt-3 text-sm text-slate-600">Questions, feedback, or partnership inquiries — we'd love to hear from you.</p>

            <form onSubmit={handleContactSubmit} className="mt-4 grid gap-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-md border border-slate-200 px-4 py-2"
                />
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full rounded-md border border-slate-200 px-4 py-2"
                />
              </div>

              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Message"
                className="w-full rounded-md border border-slate-200 px-4 py-2 h-28"
              />

              <div className="flex gap-2">
                <button type="submit" className="rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white">Send via email</button>
                <button type="button" onClick={() => { setContactName(""); setContactEmail(""); setContactMessage(""); setContactStatus(""); }} className="rounded-full border px-4 py-2 text-sm">Clear</button>
              </div>

              {contactStatus && <p className="mt-2 text-sm text-slate-600">{contactStatus}</p>}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
