// Umschalter mit mehreren Optionen, technisch eine Gruppe von Radio-Buttons.
interface Option<T extends string> {
  value: T
  label: string
}

export default function Segmented<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string
  legend: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="inline-flex rounded-[4px] border-2 border-schwarz">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="block px-4 py-2 font-semibold transition-colors peer-checked:bg-schwarz peer-checked:text-gelb peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-schwarz hover:bg-black/10 peer-checked:hover:bg-schwarz">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
