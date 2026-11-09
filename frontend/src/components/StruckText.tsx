import { Fragment, type ReactNode } from 'react'
import { STRUCK_WORD } from '../lib/format'

// Zeigt einen Text an und streicht darin „Schalke“ durch.
// `shown` ist der sichtbare Text, `source` der echte. Bei der Fallblatt-Anzeige
// unterscheiden sie sich während der Animation, haben aber dieselbe Länge,
// darum gelten die Stellen aus `source` auch für `shown`.
export default function StruckText({ source, shown = source }: { source: string; shown?: string }) {
  const parts: ReactNode[] = []
  let from = 0
  let at = source.indexOf(STRUCK_WORD)

  while (at !== -1) {
    const to = at + STRUCK_WORD.length
    parts.push(<Fragment key={`t${from}`}>{shown.slice(from, at)}</Fragment>)
    parts.push(
      <s key={`s${at}`} className="decoration-2">
        {shown.slice(at, to)}
      </s>,
    )
    from = to
    at = source.indexOf(STRUCK_WORD, from)
  }

  parts.push(<Fragment key={`t${from}`}>{shown.slice(from)}</Fragment>)
  return <>{parts}</>
}
