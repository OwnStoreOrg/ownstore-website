import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'
import { IGlobalLayoutProps } from './_app'
import { getTnCDetail } from '../http/tnc'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import EscapeHTML from '../components/EscapeHTML'
import { prepareTnCPageSeo } from '../utils/seo/pages/tnc'
import { IStaticPageDetail } from '../contract/staticPage'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    tncDetail: IStaticPageDetail
  }
}

const TnCPage: NextPage<IProps> = props => {
  const { tncDetail } = props.pageData

  return (
    <div>
      <MobileView>
        <Snackbar title={tncDetail.title} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={tncDetail.title} />
          </DesktopView>

          <div className="mt-4">
            {tncDetail.updatedDateTime ? (
              <div className="mb-3">
                <div className="font-medium font-primary-medium">
                  Date of last revision: {new Date(tncDetail.updatedDateTime).toLocaleDateString()}
                </div>
              </div>
            ) : null}

            <div className="html-body">
              <EscapeHTML element="div" html={tncDetail.body} />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const tncDetail = await getTnCDetail()

  return {
    props: {
      pageData: {
        tncDetail: tncDetail,
      },
      seo: prepareTnCPageSeo(tncDetail),
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
    revalidate: PAGE_REVALIDATE_TIME.TERMS_CONDITIONS,
  }
}

export default TnCPage
