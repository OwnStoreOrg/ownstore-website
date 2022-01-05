import React from 'react'
import ReactCollapsible from 'react-collapsible'

interface ICollapsibleProps {
  trigger: React.ReactElement
  transitionTime?: number
}

const Collapsible: React.FC<ICollapsibleProps> = props => {
  const { trigger, transitionTime, children } = props

  return (
    <ReactCollapsible trigger={trigger} transitionTime={transitionTime}>
      {children}
    </ReactCollapsible>
  )
}

export default Collapsible
