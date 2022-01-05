import React, { useContext } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from '../../_app'
import { DesktopView, MobileView } from '../../../components/ResponsiveViews'
import Snackbar from '../../../components/header/Snackbar'
import PageContainer from '../../../components/PageContainer'
import BackTitle from '../../../components/BackTitle'
import CoreLink from '../../../components/core/CoreLink'
import { PencilAltIcon, PlusIcon, KeyIcon } from '@heroicons/react/outline'
import AccountLayout from '../../../components/layout/AccountLayout'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../../components/core/CoreButton'
import { getChangePasswordPageUrl, getEditAccountPageUrl } from '../../../utils/account'
import NoContent, { NoContentType } from '../../../components/NoContent'
import { getLoginPageUrl } from '../../../utils/login'
import ApplicationContext from '../../../components/ApplicationContext'
import Loader, { LoaderType } from '../../../components/loader/Loader'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import { getFormattedDateTime } from '../../../utils/dates'
import { QUERY_PARAM_MAP } from '../../../constants/constants'
import { prepareAccountDetailsPageSeo } from '../../../utils/seo/pages/account'
import { BanIcon } from '@heroicons/react/solid'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const AccountDetailsPage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user, userGlobalDetailLoaded } = applicationContext

  const router = useRouter()

  const getFields = () => [
    {
      key: 'deactivated',
      label: (
        <div className="flex items-center">
          Deactivated
          <BanIcon className="w-5 ml-1" />
        </div>
      ),
      value:
        'Your account has been deactivated. You cannot proceed further for cart payment. Please contact us for any queries.',
      editable: false,
      show: !user.isActive,
    },
    {
      key: 'name',
      label: 'Full Name',
      value: user.name,
      editable: true,
      show: true,
    },
    {
      key: 'email',
      label: 'Email',
      value: user.email,
      editable: true,
      show: true,
    },
    {
      key: 'phone',
      label: 'Phone Number',
      value: user.phoneNumber,
      editable: true,
      show: true,
    },
    {
      key: 'joinedDate',
      label: 'Joined Date',
      value: getFormattedDateTime(user.joinedDateTime),
      editable: false,
      show: true,
    },
  ]

  const accountLinks = [
    {
      label: 'Edit Account Details',
      icon: PencilAltIcon,
      url: getEditAccountPageUrl(),
    },
    {
      label: 'Change Password',
      icon: KeyIcon,
      url: getChangePasswordPageUrl(),
    },
  ]

  const renderLoader = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader type={LoaderType.ELLIPSIS} />
        <div>Fetching your account details...</div>
      </div>
    )
  }

  const renderLoginContent = () => {
    return (
      <div>
        <NoContent message="Please login to view your account details." type={NoContentType.LOGIN} />
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
        <div>
          {getFields().map((field, index) => {
            if (!field.show) {
              return null
            }

            return (
              <div key={index} className="mb-4 lg:mb-5">
                <div className="text-primaryTextBold font-medium font-primary-medium">{field.label}</div>
                {field.value ? (
                  <div>{field.value}</div>
                ) : !field.value && field.editable ? (
                  <CoreLink
                    url={getEditAccountPageUrl()}
                    className="text-primaryText font-medium font-primary-medium flex items-center">
                    <PlusIcon className="w-5" />
                    <span className="mt-[2px]">Add</span>
                  </CoreLink>
                ) : null}
              </div>
            )
          })}
        </div>

        {/* <MobileView>
          <div className="mt-8">
            {accountLinks.map((accountLink, index) => {
              const Icon = accountLink.icon
              return (
                <div key={index}>
                  <CoreButton
                    label={
                      <React.Fragment>
                        <Icon className="w-5 mr-1" />
                        <span className="text-base">{accountLink.label}</span>
                      </React.Fragment>
                    }
                    size={CoreButtonSize.MEDIUM}
                    type={CoreButtonType.OUTLINE_SECONDARY}
                    url={accountLink.url}
                    className={classnames('no-padding no-hover-bg no-focus-boxShadow', {
                      'mt-2': index !== 0,
                    })}
                  />
                </div>
              )
            })}
          </div>
        </MobileView> */}
      </div>
    )
  }

  return (
    <div>
      <MobileView>
        <Snackbar title="Account Details" />
      </MobileView>

      <PageContainer>
        <div className="">
          <DesktopView>
            <BackTitle title="Account Details" />
          </DesktopView>

          <AccountLayout>
            <div className="px-3 mt-4 lg:mt-0">
              {!userGlobalDetailLoaded ? renderLoader() : user ? renderContent() : renderLoginContent()}
            </div>
          </AccountLayout>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareAccountDetailsPageSeo(),
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

export default AccountDetailsPage
