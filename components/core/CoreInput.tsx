import React, { useEffect, useRef } from 'react'
import { BackspaceIcon } from '@heroicons/react/solid'
import classnames from 'classnames'

export enum CoreTextInputType {
  TEXT = 'text',
  PASSWORD = 'password',
  EMAIL = 'email',
  TEL = 'tel',
  NUMBER = 'number',
}

interface ICoreInputProps {
  type: CoreTextInputType
  value: string
  setValue: (value: string) => void
  placeholder: string
  disabled?: boolean
  autoFocus?: boolean
  autoComplete?: string
  showClearIcon?: boolean
  maxLength?: number
  onClearClick?: (value: string) => void
  inputClassName?: string
  className?: string
}

const CoreTextInput = React.forwardRef<any, ICoreInputProps>((props, ref) => {
  const {
    type,
    value,
    setValue,
    placeholder,
    disabled,
    autoFocus,
    autoComplete,
    showClearIcon = false,
    onClearClick,
    inputClassName,
    className,
    maxLength,
  } = props

  const inputRef: any = ref || useRef(null)

  return (
    <div className={classnames('relative', className)}>
      <input
        type={type}
        ref={inputRef}
        className={classnames(
          {
            'pr-8-important': showClearIcon,
          },
          inputClassName
        )}
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        spellCheck="false"
        autoFocus={autoFocus}
        maxLength={maxLength}
      />
      {value && showClearIcon ? (
        <div className="cursor-pointer absolute w-6 top-1/2 transform -translate-y-1/2 right-2" title="Clear">
          <BackspaceIcon
            className="text-mineShaft transform transition-transform hover:scale-110"
            onClick={e => {
              if (onClearClick) onClearClick(value)
              inputRef.current.focus()
            }}
          />
        </div>
      ) : null}
    </div>
  )
})

CoreTextInput.displayName = 'CoreTextInput'

export default CoreTextInput
