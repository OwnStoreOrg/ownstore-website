import React from 'react'

const PageContainer: React.FC = props => {
  return <div className="container mx-auto min-h-[68vh]">{props.children}</div>
}

export default PageContainer
