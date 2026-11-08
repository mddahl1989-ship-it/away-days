import type { ReactNode } from 'react'
import { useLocation } from 'react-router'

// Gemeinsame Bausteine für alle Seiten.

export const pageClass = 'mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14'

export const inputClass =
  'w-full rounded-[4px] border-2 border-schwarz bg-white px-3 py-2.5 text-[1.0625rem] text-schwarz placeholder:text-black/40 focus:outline-3 focus:outline-offset-2 focus:outline-schwarz'

export const primaryButton =
  'inline-flex items-center justify-center rounded-[4px] bg-schwarz px-5 py-2.5 font-semibold text-gelb transition-colors hover:bg-neutral-800 disabled:opacity-60'

export const secondaryButton =
  'inline-flex items-center justify-center rounded-[4px] border-2 border-schwarz px-5 py-2 font-semibold text-schwarz transition-colors hover:bg-black/10'

export const textLink = 'font-semibold underline decoration-2 underline-offset-4 hover:decoration-[3px]'

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <h1 className="font-condensed text-5xl leading-[0.95] font-extrabold tracking-[-0.015em] md:text-7xl">{title}</h1>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  )
}

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mb-5 font-condensed text-3xl leading-none font-bold md:text-4xl">
      {children}
    </h2>
  )
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div role="alert" className="mb-6 border-l-[6px] border-rot bg-schwarz px-4 py-3 font-medium text-white">
      {message}
    </div>
  )
}

// Kurze Bestätigung nach dem Speichern, wird über den Router-State mitgegeben.
export function Flash() {
  const location = useLocation()
  const message = (location.state as { flash?: string } | null)?.flash
  if (!message) return null
  return (
    <div role="status" className="mb-6 inline-block rounded-[4px] bg-schwarz px-4 py-2 font-semibold text-gelb">
      {message}
    </div>
  )
}

export function Loading({ label = 'Lädt …' }: { label?: string }) {
  return <p className="text-black/60">{label}</p>
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string[]
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-semibold">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-sm text-black/60">{hint}</span>}
      {error?.map((message) => (
        <span key={message} className="mt-1 block text-sm font-semibold text-rot">
          {message}
        </span>
      ))}
    </label>
  )
}

export function FieldErrors({ errors }: { errors?: string[] }) {
  if (!errors) return null
  return (
    <>
      {errors.map((message) => (
        <span key={message} className="mt-1 block text-sm font-semibold text-rot">
          {message}
        </span>
      ))}
    </>
  )
}
