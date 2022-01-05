import React, { useContext, useEffect, useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from '../_app'
import { DesktopView, MobileView } from '../../components/ResponsiveViews'
import Snackbar from '../../components/header/Snackbar'
import PageContainer from '../../components/PageContainer'
import BackTitle from '../../components/BackTitle'
import AccountLayout from '../../components/layout/AccountLayout'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import NoContent, { NoContentType } from '../../components/NoContent'
import { getLoginPageUrl } from '../../utils/login'
import ApplicationContext from '../../components/ApplicationContext'
import Loader, { LoaderType } from '../../components/loader/Loader'
import { useRouter } from 'next/router'
import { prepareAccountSecurityPageSeo } from '../../utils/seo/pages/account'
import { QUERY_PARAM_MAP } from '../../constants/constants'
import { DynamicUpdateSecurityQuestionsModal } from '../../components/dynamicComponents'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import appConfig from '../../config/appConfig'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const AccountSecurityPage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user, setting, userGlobalDetailLoaded } = applicationContext

  const router = useRouter()

  const isLoading = !userGlobalDetailLoaded

  const [showUpdatePasswordHintModal, toggleUpdatePasswordHintModal] = useState(false)
  const [showUpdateSecurityQuestionsModal, toggleUpdateSecurityQuestionsModal] = useState(false)

  useEffect(() => {
    if (router.query.addSecurityQuestions) {
      toggleUpdateSecurityQuestionsModal(true)
    }
  }, [router.query.addSecurityQuestions])

  const renderLoader = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader type={LoaderType.ELLIPSIS} />
        <div>Fetching your security details...</div>
      </div>
    )
  }

  const renderLoginContent = () => {
    return (
      <div>
        <NoContent message="Please login to proceed further." type={NoContentType.LOGIN} />
        <div className="text-center">
          <CoreButton
            label="Login to view"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            url={`${getLoginPageUrl()}?${QUERY_PARAM_MAP.BACK_PAGE_URL}=${router.asPath}`}
          />
        </div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <div className="w-[70%] mr-2">
            <div className="flex items-center font-medium font-primary-medium text-primaryTextBold">
              <span>Security Questions</span>
              {setting.securityQuestionsSet ? <BadgeCheckIcon className="w-5 ml-1 " /> : null}
            </div>
            <div className="leading-5 mt-1">Use this to reset your forgotten password</div>
          </div>
          <CoreButton
            label={setting.securityQuestionsSet ? 'Update' : 'Set Now'}
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            onClick={() => toggleUpdateSecurityQuestionsModal(true)}
          />
        </div>

        <hr className="my-5 text-gray300" />

        {/* Faiyaz - Password hint is disabled due to security reasons. https://www.troyhunt.com/adobe-credentials-and-serious/ */}
        {/* <div className="flex items-start justify-between">
          <div className="w-[70%] mr-2">
            <div className="flex font-medium font-primary-medium text-primaryTextBold mr-2">
              <span>Password Hint</span>
              {user.security.passwordHintSet ? <BadgeCheckIcon className="w-5 ml-1 " /> : null}
            </div>
            <div className="leading-5 mt-1">Use this as hint when you forget your password</div>
          </div>
          <CoreButton
            label={user.security.passwordHintSet ? 'Update' : 'Set Now'}
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            onClick={() => toggleUpdatePasswordHintModal(true)}
          />
        </div> */}
      </div>
    )
  }

  const ContentDecider = () => {
    if (isLoading) {
      return renderLoader()
    }
    if (!user) {
      return renderLoginContent()
    } else {
      return renderContent()
    }
  }

  return (
    <div>
      <MobileView>
        <Snackbar title="Account Security" />
      </MobileView>

      <PageContainer>
        <div className="">
          <DesktopView>
            <BackTitle title="Account Security" />
          </DesktopView>

          <AccountLayout
            hideAccountLinks={{
              desktop: false,
              mobile: true,
            }}>
            <div className="px-3 lg:px-0 mt-4 lg:mt-0">{ContentDecider()}</div>
          </AccountLayout>
        </div>
      </PageContainer>

      {/* Faiyaz - Password hint is disabled due to security reasons. https://www.troyhunt.com/adobe-credentials-and-serious/ */}
      {/* {showUpdatePasswordHintModal ? (
        <DynamicUpdatePasswordHintModal dismissModal={() => toggleUpdatePasswordHintModal(false)} />
      ) : null} */}

      {showUpdateSecurityQuestionsModal ? (
        <DynamicUpdateSecurityQuestionsModal dismissModal={() => toggleUpdateSecurityQuestionsModal(false)} />
      ) : null}
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareAccountSecurityPageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
  }
}

export default AccountSecurityPage
