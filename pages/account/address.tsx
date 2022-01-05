import { PlusIcon } from '@heroicons/react/outline'
import { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import AddressInfo, { AddressInfoSize } from '../../components/address/AddressInfo'
import ApplicationContext from '../../components/ApplicationContext'
import BackTitle from '../../components/BackTitle'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import CoreDivider from '../../components/core/CoreDivider'
import CoreLink from '../../components/core/CoreLink'
import { DynamicAddAddressInfoModal, DynamicSupportedRegionsModal } from '../../components/dynamicComponents'
import Snackbar from '../../components/header/Snackbar'
import AccountLayout from '../../components/layout/AccountLayout'
import Loader, { LoaderType } from '../../components/loader/Loader'
import NoContent, { NoContentType } from '../../components/NoContent'
import PageContainer from '../../components/PageContainer'
import { DesktopView, MobileView } from '../../components/ResponsiveViews'
import { toastError, toastSuccess } from '../../components/Toaster'
import { AnalyticsEventType } from '../../constants/analytics'
import { QUERY_PARAM_MAP } from '../../constants/constants'
import { IUserAddressInfo } from '../../contract/address'
import { addSessionUserAddressInfo } from '../../http/address'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { addUserAddress } from '../../utils/account'
import { filterInactiveItem } from '../../utils/common'
import { getLoginPageUrl } from '../../utils/login'
import { prepareAccountAddressPageSeo } from '../../utils/seo/pages/account'
import { hasNoSupportedRegions } from '../../utils/supportedRegions'
import { IGlobalLayoutProps } from '../_app'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const AccountAddressPage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user, updaters, userGlobalDetailLoaded, supportedRegions } = applicationContext

  const isLoading = !userGlobalDetailLoaded

  const router = useRouter()

  const [addAddressModal, toggleAddAddressModal] = useState(false)
  const [addLoading, toggleAddLoading] = useState(false)
  const [showSupportedRegionsModal, toggleSupportedRegionsModal] = useState(false)

  const activeAddresses = filterInactiveItem(user?.addresses || [])

  const addAddressParam = router.query[QUERY_PARAM_MAP.ADD_ADDRESS]

  useEffect(() => {
    if (addAddressParam) {
      toggleAddAddressModal(true)
    }
  }, [addAddressParam])

  const closeAddAddressModal = () => {
    if (addAddressParam === 'true') {
      router.back()
    } else {
      toggleAddAddressModal(false)
    }
  }

  const saveAddress = (address: IUserAddressInfo) => {
    const { id, ...restAddress } = address
    toggleAddLoading(true)
    addSessionUserAddressInfo(restAddress)
      .then(resp => {
        if (resp.success) {
          updaters.updateUser({
            ...user,
            addresses: addUserAddress(user.addresses, resp.userAddress),
          })
          appAnalytics.sendEvent({
            action: AnalyticsEventType.ADD_ADDRESS,
            extra: {
              address: address,
            },
          })
          toastSuccess('Added successfully')
        }
      })
      .catch(e => {
        toastError('Failed to add')
      })
      .finally(() => {
        closeAddAddressModal()
        toggleAddLoading(false)
      })
  }

  const renderLoader = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader type={LoaderType.ELLIPSIS} />
        <div>Fetching your saved addresses...</div>
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div>
        {activeAddresses.map((address, index) => {
          return (
            <div key={index}>
              <AddressInfo size={AddressInfoSize.LARGE} address={address} />

              <MobileView>
                <CoreDivider className="my-2 lg:my-6" />
              </MobileView>
              <DesktopView>
                {index !== activeAddresses.length - 1 ? <CoreDivider className="my-2 lg:my-6" /> : null}
              </DesktopView>
            </div>
          )
        })}
      </div>
    )
  }

  const renderNoContent = () => {
    return (
      <div>
        <NoContent message="No saved address found. Please add one!" />
        <div className="text-center">
          <CoreButton
            label="Add New Address"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            onClick={() => toggleAddAddressModal(true)}
          />
        </div>
      </div>
    )
  }

  const renderLoginContent = () => {
    return (
      <div>
        <NoContent message="Please login to view your saved addresses." type={NoContentType.LOGIN} />
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

  const ContentDecider = () => {
    if (isLoading) {
      return renderLoader()
    }
    if (!user) {
      return renderLoginContent()
    } else {
      if (!activeAddresses.length) {
        return renderNoContent()
      } else {
        return renderContent()
      }
    }
  }

  const renderSupportedRegionsMessage = () => {
    if (!user) {
      return null
    }

    if (hasNoSupportedRegions(supportedRegions)) {
      return null
    }

    return (
      <div className="px-2 py-3 lg:py-0">
        Please have a look at the regions we are currently supporting before adding a new address.{' '}
        <CoreLink
          url=""
          onClick={() => toggleSupportedRegionsModal(true)}
          className="font-medium font-primary-medium underline">
          View here
        </CoreLink>
      </div>
    )
  }

  const renderAddAddressButton = () => {
    if (!user) {
      return null
    }

    return (
      <div
        className="flex border-gray500 p-3 mb-3 lg:mb-0 shadow lg:shadow-none lg:justify-end items-center font-medium font-primary-medium text-primaryTextBold bg-white transition-all hover:bg-gray100 cursor-pointer lg:absolute right-0 lg:rounded"
        onClick={() => toggleAddAddressModal(true)}>
        <PlusIcon className="w-5 mr-1" />
        <span className="text-base">Add New Address</span>
      </div>
    )
  }

  return (
    <div>
      <MobileView>
        <Snackbar title="Saved Addresses" />
      </MobileView>

      <MobileView>{renderAddAddressButton()}</MobileView>

      <PageContainer>
        <div className="relative">
          <DesktopView>
            <BackTitle title="Saved Addresses" />
          </DesktopView>

          <AccountLayout
            hideAccountLinks={{
              desktop: false,
              mobile: true,
            }}>
            <DesktopView>{renderSupportedRegionsMessage()}</DesktopView>
            <DesktopView>{renderAddAddressButton()}</DesktopView>
            <MobileView>{renderSupportedRegionsMessage()}</MobileView>

            <div className="lg:mt-12">{ContentDecider()}</div>
          </AccountLayout>
        </div>
      </PageContainer>

      {addAddressModal ? (
        <DynamicAddAddressInfoModal
          dismiss={() => closeAddAddressModal()}
          title="Add New Address"
          cta={{
            primary: {
              show: true,
              label: 'Save',
              loading: addLoading,
              onClick: saveAddress,
            },
            secondary: {
              show: true,
              label: 'Cancel',
              onClick: () => closeAddAddressModal(),
            },
          }}
        />
      ) : null}

      {showSupportedRegionsModal ? (
        <DynamicSupportedRegionsModal dismissModal={() => toggleSupportedRegionsModal(false)} />
      ) : null}
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareAccountAddressPageSeo(),
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

export default AccountAddressPage
