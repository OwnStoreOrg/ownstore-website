import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { QUERY_PARAM_MAP } from '../../constants/constants'
import { prepareImageUrl } from '../../utils/image'
import { getLoginPageUrl } from '../../utils/login'
import { getSignupPageUrl } from '../../utils/signup'
import ApplicationContext from '../ApplicationContext'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import Modal from '../modal/Modal'

interface ILoginModalProps {
  toggleModal: (val: boolean) => void
}

const LoginPromptModal: React.FC<ILoginModalProps> = props => {
  const { toggleModal } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  useEffect(() => {
    if (user) {
      toggleModal(false)
    }
  }, [user])

  const router = useRouter()

  const loginPages = [getLoginPageUrl(), getSignupPageUrl()]

  return (
    <Modal dismissModal={() => toggleModal(false)} className="loginPromptModalOverrides">
      <div className="flex flex-col items-center px-4 pb-4">
        <CoreImage
          url={prepareImageUrl('/images/ribbon.png', ImageSourceType.ASSET)}
          alt="Login promt"
          className="w-32 min-h-32 mb-4"
          disableLazyload
        />
        <div className="text-primaryText text-base mb-6 text-center">
          <span>Please log in to access your account, orders and much more...</span>
        </div>
        <div className="">
          <CoreButton
            label={'Proceed to Login'}
            size={CoreButtonSize.LARGE}
            type={CoreButtonType.SOLID_PRIMARY}
            onClick={() => {
              if (loginPages.some(page => page.includes(router.pathname))) {
                router.push(getLoginPageUrl())
              } else {
                router.push(`${getLoginPageUrl()}?${QUERY_PARAM_MAP.BACK_PAGE_URL}=${router.asPath}`)
              }
              toggleModal(false)
            }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default LoginPromptModal
