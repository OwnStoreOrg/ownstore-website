import React from 'react'
import classnames from 'classnames'

interface ICoreCheckboxProps {
  onChange: (val: boolean) => void
  id: string
  checked: boolean
  label?: string
  className?: string
  disabled?: boolean
}

const CoreCheckbox: React.FC<ICoreCheckboxProps> = props => {
  const { onChange, id, label, checked, className, disabled } = props

  return (
    <div className={classnames('radio-button flex items-center', className)}>
      <input type="checkbox" id={id} onChange={e => onChange(e.target.checked)} checked={checked} disabled={disabled} />
      {label ? (
        <label htmlFor={id} className="ml-2">
          {label}
        </label>
      ) : null}
    </div>
  )
}

export default CoreCheckbox
