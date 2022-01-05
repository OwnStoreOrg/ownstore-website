// Faiyaz - Password hint is disabled due to security reasons. https://www.troyhunt.com/adobe-credentials-and-serious/

import React, { useContext, useRef, useState } from 'react'
import { REGEX_MAP } from '../../constants/constants'
import useOnEnter from '../../hooks/useOnEnter'
import ApplicationContext from '../ApplicationContext'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import Modal from '../modal/Modal'
import { toastError, toastSuccess } from '../Toaster'
import classnames from 'classnames'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { updateSessionUserPasswordHintInfo } from '../../http/security'
import ApiError from '../../error/ApiError'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import FullWidthModal from '../modal/FullWidthModal'

interface IUpdatePasswordHintModalProps {
  dismissModal: () => void
}

const UpdatePasswordHintModal: React.FC<IUpdatePasswordHintModalProps> = props => {
  const { dismissModal } = props

  const applicationContext = useContext(ApplicationContext)
  const { user, setting } = applicationContext

  const formRef = useRef(null)

  const [loading, toggleLoading] = useState(false)

  const [state, dispatch] = useState({
    password: '',
    hint: '',
  })

  const [fieldsWithError, setFieldsWithError] = useState({
    PASSWORD: false,
    HINT: false,
  })

  const updateField = (key: string, value: string) => {
    dispatch({
      ...state,
      [key]: value,
    })
  }

  const FIELD_VALIDATION_MAPPING = {
    PASSWORD: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid password',
      value: state.password,
      key: 'PASSWORD',
    },
    HINT: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid HINT',
      value: state.hint,
      key: 'HINT',
    },
  }

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const validatedFields = Object.values(FIELD_VALIDATION_MAPPING).map(field => {
      return {
        ...field,
        valid: field.regex.test(field.value),
      }
    })

    const updatedFieldsWithError = validatedFields.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.key]: !cur.valid,
      }
    }, fieldsWithError)

    setFieldsWithError(updatedFieldsWithError)

    const invalidFields = validatedFields.filter(field => !field.valid)

    if (invalidFields.length) {
      toastError(invalidFields[0].error)
    } else {
      toggleLoading(true)

      updateSessionUserPasswordHintInfo({
        password: state.password,
        hint: state.hint,
      })
        .then(resp => {
          if (resp.success) {
            toastSuccess('Updated successfully')
            applicationContext.updaters.updateSetting({
              ...setting,
            })
            appAnalytics.sendEvent({
              action: AnalyticsEventType.UPDATE_PASSWORD_HINT,
            })
            dismissModal()
          }
        })
        .catch(err => {
          if (err instanceof ApiError && err.response.code !== 'UNKNOWN') {
            toastError(err.response.message || 'Failed to update password hint')
          } else {
            toastError('Failed to update password hint')
          }
        })
        .finally(() => {
          toggleLoading(false)
        })
    }
  }

  useOnEnter(formRef, handleSubmit)

  return (
    <FullWidthModal
      modal={{
        dismissModal: dismissModal,
        // title={user.security.passwordHintSet ? 'Update password hint' : 'Set password hint'}
        title: 'Update password hint',
        disableOutsideClick: true,
      }}
      footer={{
        buttons: [
          {
            // label={user.security.passwordHintSet ? 'Update' : 'Set'}
            label: 'Update',
            size: CoreButtonSize.LARGE,
            type: CoreButtonType.SOLID_PRIMARY,
            className: 'w-full rounded-none lg:rounded-b-md py-3 border-primary',
            loading: loading,
            onClick: handleSubmit,
          },
        ],
      }}>
      <div ref={formRef} className="pt-4">
        <div className="user-input-group px-2 lg:px-3">
          <div className="user-input-label">Current Password *</div>
          <CoreTextInput
            type={CoreTextInputType.PASSWORD}
            placeholder="Password"
            value={state.password}
            setValue={value => updateField('password', value)}
            autoFocus
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.PASSWORD,
            })}
          />
        </div>
        <div className="user-input-group px-2 lg:px-3">
          <div className="user-input-label">Password Hint *</div>
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Hint"
            value={state.hint}
            setValue={value => updateField('hint', value)}
            autoComplete="off"
            maxLength={40}
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.HINT,
            })}
          />
          <div className="text-sm mt-2">Note: Please make sure not to include your password in hint.</div>
        </div>
      </div>
    </FullWidthModal>
  )
}

export default UpdatePasswordHintModal
