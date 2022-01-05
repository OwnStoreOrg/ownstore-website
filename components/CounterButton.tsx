import React from 'react'
import { MinusSmIcon, PlusIcon } from '@heroicons/react/solid'
import classnames from 'classnames'

interface ICounterButtonProps {
  count: number | string
  onDecrement?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onIncrement?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  className?: string
  disabled?: boolean
}

const CounterButton: React.FC<ICounterButtonProps> = props => {
  const { count, onDecrement, onIncrement, className, disabled } = props

  return (
    <div
      className={classnames(
        'bg-gray100 rounded-lg p-1 py-[6px] flex justify-around items-center w-24 font-medium font-primary-medium select-none',
        className,
        disabled ? 'text-blackHalfLight' : 'text-primaryTextBold'
      )}>
      <div
        className={classnames(
          disabled ? 'cursor-auto' : 'cursor-pointer transform transition-transform hover:scale-125'
        )}
        onClick={onDecrement}>
        <MinusSmIcon className="w-5" />
      </div>
      <div className="text-sm">{count}</div>
      <div
        className={classnames(
          disabled ? 'cursor-auto' : 'cursor-pointer transform transition-transform hover:scale-125'
        )}
        onClick={onIncrement}>
        <PlusIcon className="w-5" />
      </div>
    </div>
  )
}

export default CounterButton
