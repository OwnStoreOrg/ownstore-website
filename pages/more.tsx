import {
  ShoppingBagIcon,
  UserIcon,
  LocationMarkerIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LogoutIcon,
  CollectionIcon,
  TemplateIcon,
  PhoneIcon,
  UserCircleIcon,
  LoginIcon,
  ColorSwatchIcon,
} from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { GetStaticProps, NextPage } from 'next'
import React, { useContext } from 'react'
import { getLoginPageUrl } from '../utils/login'
import { IGlobalLayoutProps } from './_app'
import classnames from 'classnames'
import PageContainer from '../components/PageContainer'
import CoreLink from '../components/core/CoreLink'
import { getCatalogueIndexPageUrl } from '../utils/catalogue'
import { getExplorePageUrl } from '../utils/explore'
import { getFaqTopicsIndexPageUrl } from '../utils/faq'
import { getTnCPageUrl } from '../utils/tnc'
import { getPrivacyPageUrl } from '../utils/privacyPolicy'
import { getContactPageUrl } from '../utils/contact'
import { getAddressPageUrl, getAccountDetailsPageUrl, getOrdersPageUrl } from '../utils/account'
import ApplicationContext from '../components/ApplicationContext'
import { getSignupPageUrl } from '../utils/signup'
import { useRouter } from 'next/router'
import { toastSuccess } from '../components/Toaster'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const MorePage: NextPage<IProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const { user, logout } = applicationContext

  const router = useRouter()

  const LINKS = [
    {
      label: 'Account',
      subTitle: 'View your account details',
      url: getAccountDetailsPageUrl(),
      icon: UserIcon,
      show: !!user,
    },
    {
      label: 'Addresses',
      subTitle: 'Your saved addresses',
      url: getAddressPageUrl(),
      icon: LocationMarkerIcon,
      show: !!user,
    },
    {
      label: 'Orders',
      subTitle: 'Check your past orders',
      url: getOrdersPageUrl(),
      icon: ShoppingBagIcon,
      show: !!user,
    },
    {
      label: 'Login',
      subTitle: 'Login to sync your data',
      url: getLoginPageUrl(),
      icon: LoginIcon,
      show: !user,
    },
    {
      label: 'Signup',
      subTitle: 'Create your account',
      url: getSignupPageUrl(),
      icon: UserCircleIcon,
      show: !user,
    },
    {
      label: 'Catalogues',
      subTitle: 'Our collection of catalogues',
      url: getCatalogueIndexPageUrl(),
      icon: CollectionIcon,
      show: true,
    },
    {
      label: 'Explore',
      subTitle: 'Explore our curated sections',
      url: getExplorePageUrl(),
      icon: ColorSwatchIcon,
      show: true,
    },
    {
      label: 'FAQs',
      subTitle: '',
      url: getFaqTopicsIndexPageUrl(),
      icon: QuestionMarkCircleIcon,
      show: true,
    },
    {
      label: 'Terms & Conditions',
      subTitle: '',
      url: getTnCPageUrl(),
      icon: ShieldCheckIcon,
      show: true,
    },
    {
      label: 'Privacy Policy',
      subTitle: '',
      url: getPrivacyPageUrl(),
      icon: DocumentTextIcon,
      show: true,
    },
    {
      label: 'Contact Us',
      subTitle: '',
      url: getContactPageUrl(),
      icon: PhoneIcon,
      show: true,
    },
    {
      label: 'Logout',
      subTitle: '',
      url: null,
      icon: LogoutIcon,
      show: !!user,
      onClick: () => {
        logout()
        toastSuccess('Logged out')
        router.push(getLoginPageUrl())
      },
    },
  ]

  return (
    <div>
      <PageContainer>
        <div className="pb-8">
          {LINKS.map((link, index) => {
            const IconComponent = link.icon

            if (!link.show) {
              return null
            }

            return (
              <CoreLink
                key={index}
                url={link.url}
                onClick={() => {
                  if (link.onClick) {
                    link.onClick()
                  }
                }}
                className={classnames(
                  'flex items-center w-full p-4 lg:px-2 lg:py-5 transition-all bg-white hover:bg-gray100 group',
                  {
                    'border-b border-gray400': index + 1 !== LINKS.length,
                  }
                )}>
                <div className="mr-3">
                  <IconComponent className="w-6" />
                </div>

                <div className="flex flex-grow justify-between items-center">
                  <div>
                    <div className="text-gray900 font-normal font-primary-medium">{link.label}</div>
                    <div className="text-sm text-gray700">{link.subTitle}</div>
                  </div>
                  <div>
                    <ChevronRightIcon className="w-5 text-gray700 transform transition-transform group-hover:scale-125" />
                  </div>
                </div>
              </CoreLink>
            )
          })}
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: null,
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: false,
        },
      },
      analytics: null,
    },
  }
}

export default MorePage
