import React from 'react'
import appConfig from '../config/appConfig'
import { SCREEN_SIZE } from '../constants/constants'

export const AppContextScript = () => (
  <>
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
          window.APP = window.APP || {};
        `,
      }}
    />
  </>
)
