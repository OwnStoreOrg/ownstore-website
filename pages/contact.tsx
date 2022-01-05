import React from 'react'
import { LocationMarkerIcon, MailIcon, PhoneIcon } from '@heroicons/react/solid'
import { GetStaticProps, NextPage } from 'next'
import BackTitle from '../components/BackTitle'
import CoreImage from '../components/core/CoreImage'
import CoreLink from '../components/core/CoreLink'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import appConfig from '../config/appConfig'
import { SOCIAL_ICONS_SRC_MAP } from '../constants/constants'
import { IGlobalLayoutProps } from './_app'
import { prepareContactPageSeo } from '../utils/seo/pages/contact'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ContactPage: NextPage<IProps> = props => {
  const links = [
    {
      value: Object.values(appConfig.company.address).join(', '),
      iconComponent: LocationMarkerIcon,
      url: '',
      isExternal: false,
    },
    {
      value: appConfig.company.contactNumber,
      iconComponent: PhoneIcon,
      url: `tel:${appConfig.company.contactNumber}`,
      isExternal: false,
    },
    {
      value: appConfig.company.contactEmail,
      iconComponent: MailIcon,
      url: `mailto:${appConfig.company.contactEmail}`,
      isExternal: false,
    },
  ]

  return (
    <div>
      <MobileView>
        <Snackbar title="Contact Us" />
      </MobileView>

      <PageContainer>
        <DesktopView>
          <BackTitle title="Contact Us" />
        </DesktopView>

        <div className="md:max-w-[720px] mx-auto px-2 mt-5">
          <div className="text-center">
            <div className="text-primaryTextBold font-medium font-primary-medium text-xl">Get in touch!</div>
            <div className="text-base">Contact us for any queries or questions.</div>
          </div>

          <div className="mt-5">
            {links.map((link, index) => {
              const IconComponent = link.iconComponent

              const content = (
                <div className="flex items-start rounded border-gray400 p-3 mb-2 bg-white hover:bg-gray100 hover:text-primaryText group cursor-pointer transition-all">
                  <div className="mr-2">
                    <IconComponent className="w-6 group-hover:text-primaryTextBold" />
                  </div>
                  <div>{link.value}</div>
                </div>
              )

              if (!link.url) {
                return content
              }

              return (
                <CoreLink key={index} url={link.url} isExternal={link.isExternal}>
                  {content}
                </CoreLink>
              )
            })}
          </div>

          <div className="flex justify-center mt-5">
            {appConfig.company.socialLinks.map((socialLink, index) => {
              const socialIconSrc = SOCIAL_ICONS_SRC_MAP[socialLink.type] || SOCIAL_ICONS_SRC_MAP.GLOBE

              return (
                <CoreLink
                  key={index}
                  url={socialLink.url}
                  isExternal={socialLink.isExternal}
                  title={socialLink.name}
                  className="flex items-start rounded border-gray400 p-2 mx-1 transform transition-transform hover:scale-110">
                  <CoreImage url={socialIconSrc} alt="" useTransparentPlaceholder className="w-6" />
                </CoreLink>
              )
            })}
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: {},
      seo: prepareContactPageSeo(),
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

export default ContactPage
