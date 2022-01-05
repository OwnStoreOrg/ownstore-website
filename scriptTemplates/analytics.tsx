import React from 'react'
import appConfig from '../config/appConfig'

const GoogleAnalyticsScripts: React.FC = () => {
  if (!appConfig.integrations.googleAnalytics.enabled) {
    return null
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${appConfig.integrations.googleAnalytics.webCode}`}></script>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function ga(){dataLayer.push(arguments);}
      
          ga('js', new Date());
          ga('config', '${appConfig.integrations.googleAnalytics.webCode}', {
            transport_type: 'beacon',
            send_page_view: false,
          });
        `,
        }}
      />
    </>
  )
}

export const AnalyticsScripts: React.FC = props => {
  return (
    <>
      <GoogleAnalyticsScripts />
    </>
  )
}
