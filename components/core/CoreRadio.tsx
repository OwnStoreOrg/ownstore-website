import React from 'react'
import classnames from 'classnames'

interface ICoreRadioProps {
  value: string
  onChange: (val: string) => void
  id: string
  checked: boolean
  label?: string
  className?: string
}

const CoreRadio: React.FC<ICoreRadioProps> = props => {
  const { value, onChange, id, label, checked, className } = props

  return (
    <div className={classnames('radio-button flex items-center', className)}>
      <input type="radio" value={value} id={id} onChange={e => onChange(e.target.value)} checked={checked} />
      {label ? (
        <label htmlFor={id} className="ml-2 cursor-pointer">
          {label}
        </label>
      ) : null}
    </div>
  )
}

export default CoreRadio
