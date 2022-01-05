import { InformationCircleIcon, ShieldExclamationIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { getSecurityPageUrl } from '../../utils/account'
import ApplicationContext from '../ApplicationContext'
import CoreLink from '../core/CoreLink'

interface IAddSecurityQuestionsMessageProps {}

const AddSecurityQuestionsMessage: React.FC<IAddSecurityQuestionsMessageProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const { user, setting } = applicationContext

  const router = useRouter()

  if (!user) {
    return null
  }

  if (setting.securityQuestionsSet) {
    return null
  }

  return (
    <div className="px-3 py-3 bg-gray200 text-sm font-medium font-primary-medium lg:rounded-md lg:mb-4 lg:w-auto lg:flex items-center">
      <ShieldExclamationIcon className="w-5 mr-1 inline relative " />
      <span className="">Add security questions to recover your account securely.</span>{' '}
      {router.pathname.includes('/account/security') ? null : (
        <CoreLink url={getSecurityPageUrl()} className="underline ml-1">
          Click here
        </CoreLink>
      )}
    </div>
  )
}

export default AddSecurityQuestionsMessage
