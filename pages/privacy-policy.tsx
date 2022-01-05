import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'
import { IGlobalLayoutProps } from './_app'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import EscapeHTML from '../components/EscapeHTML'
import { getPrivacyPolicyDetail } from '../http/privacyPolicy'
import { preparePrivacyPolicyPageSeo } from '../utils/seo/pages/privacyPolicy'
import { IStaticPageDetail } from '../contract/staticPage'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    privacyPolicyDetail: IStaticPageDetail
  }
}

const PrivacyPolicyPage: NextPage<IProps> = props => {
  const { privacyPolicyDetail } = props.pageData

  return (
    <div>
      <MobileView>
        <Snackbar title={privacyPolicyDetail.title} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={privacyPolicyDetail.title} />
          </DesktopView>

          <div className="mt-4">
            {privacyPolicyDetail.updatedDateTime ? (
              <div className="mb-3">
                <div className="font-medium font-primary-medium">
                  Date of last revision: {new Date(privacyPolicyDetail.updatedDateTime).toLocaleDateString()}
                </div>
              </div>
            ) : null}

            <div className="html-body">
              <EscapeHTML element="div" html={privacyPolicyDetail.body} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const privacyPolicyDetail = await getPrivacyPolicyDetail()

  return {
    props: {
      pageData: {
        privacyPolicyDetail: privacyPolicyDetail,
      },
      seo: preparePrivacyPolicyPageSeo(privacyPolicyDetail),
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
    revalidate: PAGE_REVALIDATE_TIME.PRIVACY_POLICY,
  }
}

export default PrivacyPolicyPage
