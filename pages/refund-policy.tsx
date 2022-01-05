import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'
import { IGlobalLayoutProps } from './_app'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import EscapeHTML from '../components/EscapeHTML'
import { getRefundPolicyDetail } from '../http/refundPolicy'
import { prepareRefundPolicyPageSeo } from '../utils/seo/pages/refundPolicy'
import { IStaticPageDetail } from '../contract/staticPage'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    refundPolicyDetail: IStaticPageDetail
  }
}

const RefundPolicyPage: NextPage<IProps> = props => {
  const { refundPolicyDetail } = props.pageData

  return (
    <div>
      <MobileView>
        <Snackbar title={refundPolicyDetail.title} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={refundPolicyDetail.title} />
          </DesktopView>

          <div className="mt-4">
            {refundPolicyDetail.updatedDateTime ? (
              <div className="mb-3">
                <div className="font-medium font-primary-medium">
                  Date of last revision: {new Date(refundPolicyDetail.updatedDateTime).toLocaleDateString()}
                </div>
              </div>
            ) : null}

            <div className="html-body">
              <EscapeHTML element="div" html={refundPolicyDetail.body} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const refundPolicyDetail = await getRefundPolicyDetail()

  return {
    props: {
      pageData: {
        refundPolicyDetail: refundPolicyDetail,
      },
      seo: prepareRefundPolicyPageSeo(refundPolicyDetail),
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
    revalidate: PAGE_REVALIDATE_TIME.REFUND_POLICY,
  }
}

export default RefundPolicyPage
