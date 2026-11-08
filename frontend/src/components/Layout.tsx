import { NavLink, Outlet } from 'react-router'
import Emblem from './Emblem'

const links = [
  { to: '/', label: 'Übersicht', end: true },
  { to: '/matches', label: 'Spielplan', end: false },
  { to: '/trips', label: 'Fahrtenbuch', end: false },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="on-black bg-schwarz text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 md:px-8">
          <NavLink to="/" className="flex items-center gap-3 rounded-sm" aria-label="AwayDays, zur Übersicht">
            <Emblem />
            <span className="font-condensed text-[1.9rem] leading-none font-extrabold tracking-[-0.01em]">AwayDays</span>
          </NavLink>
          <nav aria-label="Hauptnavigation">
            <ul className="flex gap-1 md:gap-2">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `block rounded-sm px-3 py-2 font-condensed text-lg font-semibold transition-colors md:text-xl ${
                        isActive
                          ? 'text-gelb shadow-[inset_0_-3px_0_var(--color-gelb)]'
                          : 'text-white/75 hover:text-white'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t-2 border-schwarz">
        <div className="mx-auto max-w-6xl px-5 py-6 text-sm text-black/65 md:px-8">
          AwayDays ist ein privates Fahrtenbuch für Stadionbesuche. Projekt aus der Umschulung zum Software-Entwickler.
        </div>
      </footer>
    </div>
  )
}
