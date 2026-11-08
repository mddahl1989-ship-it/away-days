import { Link } from 'react-router'
import { pageClass, primaryButton } from '../components/ui'

export default function NotFoundPage() {
  return (
    <div className={pageClass}>
      <h1 className="font-condensed text-[5rem] leading-none font-extrabold md:text-[9rem]">Abseits.</h1>
      <p className="mt-4 max-w-[45ch] text-xl">Diese Seite gibt es nicht. Vielleicht hat sich in der Adresse ein Tippfehler eingeschlichen.</p>
      <Link to="/" className={`${primaryButton} mt-8`}>
        Zur Übersicht
      </Link>
    </div>
  )
}
