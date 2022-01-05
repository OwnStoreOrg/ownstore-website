import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'
import { IGlobalLayoutProps } from './_app'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import EscapeHTML from '../components/EscapeHTML'
import { getShippingPolicyDetail } from '../http/shippingPolicy'
import { prepareShippingPolicyPageSeo } from '../utils/seo/pages/shippingPolicy'
import { IStaticPageDetail } from '../contract/staticPage'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    shippingPolicyDetail: IStaticPageDetail
  }
}

const ShippingPolicyPage: NextPage<IProps> = props => {
  const { shippingPolicyDetail } = props.pageData

  return (
    <div>
      <MobileView>
        <Snackbar title={shippingPolicyDetail.title} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={shippingPolicyDetail.title} />
          </DesktopView>

          <div className="mt-4">
            {shippingPolicyDetail.updatedDateTime ? (
              <div className="mb-3">
                <div className="font-medium font-primary-medium">
                  Date of last revision: {new Date(shippingPolicyDetail.updatedDateTime).toLocaleDateString()}
                </div>
              </div>
            ) : null}

            <div className="html-body">
              <EscapeHTML element="div" html={shippingPolicyDetail.body} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const ShippingPolicyDetail = await getShippingPolicyDetail()

  return {
    props: {
      pageData: {
        shippingPolicyDetail: ShippingPolicyDetail,
      },
      seo: prepareShippingPolicyPageSeo(ShippingPolicyDetail),
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
    revalidate: PAGE_REVALIDATE_TIME.SHIPPING_POLICY,
  }
}

export default ShippingPolicyPage
