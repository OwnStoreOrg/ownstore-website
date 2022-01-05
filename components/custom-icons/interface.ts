import { MouseEvent } from 'react'

export interface ICustomIconProps {
  className?: string
  onClick?: (e: MouseEvent<HTMLOrSVGElement>) => void
}
