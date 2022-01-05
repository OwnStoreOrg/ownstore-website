import React from 'react'

interface ICoreTextareaProps {
  value: string
  setValue: (val: string) => void
  placeholder: string
  disabled?: boolean
  autoFocus?: boolean
  autoComplete?: string
  maxLength?: number
  className?: string
}

const CoreTextarea: React.FC<ICoreTextareaProps> = props => {
  const { value, setValue, placeholder, disabled, autoFocus, autoComplete, maxLength, className } = props

  return (
    <textarea
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      spellCheck="false"
      autoFocus={autoFocus}
      maxLength={maxLength}
      className={className}></textarea>
  )
}

export default CoreTextarea
