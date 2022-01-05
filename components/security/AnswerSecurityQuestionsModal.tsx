import React, { useContext, useEffect, useRef, useState } from 'react'
import { IUserSecurityQuestionsDetail } from '../../contract/security'
import useOnEnter from '../../hooks/useOnEnter'
import {
  getAllSecurityQuestions,
  getSessionSecurityQuestionsDetail,
  updateUserSecurityQuestionAnswers,
  verifyUserSecurityQuestionAnswers,
} from '../../http/security'
import ApplicationContext from '../ApplicationContext'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import CoreSelectInput from '../core/CoreSelectInput'
import Loader, { LoaderType } from '../loader/Loader'
import Modal from '../modal/Modal'
import classnames from 'classnames'
import { isEmptyObject } from '../../utils/common'
import { toastError, toastSuccess } from '../Toaster'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { QUERY_PARAM_MAP, REGEX_MAP } from '../../constants/constants'
import { ISecurityAnswerInfo, ISecurityQuestionInfo } from '../../contract/security'
import ApiError from '../../error/ApiError'
import { resetUserPassword } from '../../http/user'
import { onLoginSuccess, getUserLoginAttributes } from '../../utils/login'
import { LoginSourceType, LoginType } from '../../contract/constants'
import appConfig from '../../config/appConfig'
import { useRouter } from 'next/router'
import { getHomePageUrl } from '../../utils/home'
import FullWidthModal from '../modal/FullWidthModal'

interface IAnswerSecurityQuestionsModalProps {
  dismissModal: () => void
}

const AnswerSecurityQuestionsModal: React.FC<IAnswerSecurityQuestionsModalProps> = props => {
  const { dismissModal } = props

  const applicationContext = useContext(ApplicationContext)
  const router = useRouter()

  const formRef = useRef(null)

  const backPageUrl = router.query[QUERY_PARAM_MAP.BACK_PAGE_URL] as string | undefined

  const MAX_QUESTIONS_ALLOWED = appConfig.global.minSecurityQuestions
  const defaultQuestionsList = [...Array(3).keys()].map(e => e + 1)

  const getInitialState = () => {
    return defaultQuestionsList.reduce((acc, cur) => {
      acc[cur] = {
        questionId: '',
        answer: '',
      }
      return acc
    }, {})
  }

  const [allQuestions, setAllQuestions] = useState<ISecurityQuestionInfo[]>([])
  const [loading, toggleLoading] = useState(false)
  const [questionsState, setQuestionsState] = useState<Record<number, ISecurityAnswerInfo>>(getInitialState())
  const [email, setEmail] = useState('')

  const [invalidField, setInvalidField] = useState({
    EMAIL: false,
    NEW_PASSWORD: false,
    CONFIRM_NEW_PASSWORD: false,
  })

  const [verified, toggleVerified] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  useEffect(() => {
    getAllSecurityQuestions()
      .then(resp => {
        setAllQuestions(resp)
      })
      .catch(console.error)
  }, [])

  const updateQuestionsState = (key: number, questionId: number | undefined, answer: string | undefined) => {
    setQuestionsState({
      ...questionsState,
      [key]: {
        ...questionsState[key],
        ...(questionId !== undefined && { questionId: questionId }),
        ...(answer !== undefined && { answer: answer }),
      },
    })
  }

  const resetPassword = () => {
    if (!REGEX_MAP.PASSWORD.test(newPassword)) {
      toastError('Invalid password')
      setInvalidField({
        ...invalidField,
        NEW_PASSWORD: true,
      })
    } else if (!REGEX_MAP.PASSWORD.test(confirmNewPassword)) {
      toastError('Invalid confirm password')
      setInvalidField({
        ...invalidField,
        CONFIRM_NEW_PASSWORD: true,
      })
    } else if (newPassword !== confirmNewPassword) {
      toastError(`Passwords don't match`)
    } else {
      toggleLoading(true)

      resetUserPassword({
        email: email,
        password: newPassword,
        loginAttributes: getUserLoginAttributes(LoginType.LOGIN, LoginSourceType.MANUAL_RESET, applicationContext),
        securityAnswers: Object.values(questionsState) as any,
      })
        .then(resp => {
          if (resp.success) {
            onLoginSuccess(resp.token, resp.user, applicationContext)
            toastSuccess('Password reset successfully')
            appAnalytics.sendEvent({
              action: AnalyticsEventType.RESET_PASSWORD,
            })
            dismissModal()

            if (backPageUrl) {
              router.push(backPageUrl)
            } else {
              router.push(getHomePageUrl())
            }
          }
        })
        .finally(() => toggleLoading(false))
    }
  }

  const verifySecurityQuestions = () => {
    const questionsStateInvalid = Object.values(questionsState).some(s => !s.answer)
    const invalidEmail = !REGEX_MAP.EMAIL.test(email)

    if (invalidEmail) {
      toastError('Invalid email')
      setInvalidField({
        ...invalidField,
        EMAIL: true,
      })
    } else if (questionsStateInvalid) {
      toastError(`Minimum ${MAX_QUESTIONS_ALLOWED} answers are required`)
    } else {
      toggleLoading(true)

      verifyUserSecurityQuestionAnswers({
        email: email,
        securityAnswers: Object.values(questionsState) as any,
      })
        .then(resp => {
          if (resp.success) {
            toastSuccess('Verified successfully')
            appAnalytics.sendEvent({
              action: AnalyticsEventType.ANSWER_SECURITY_QUESTIONS,
            })
            toggleVerified(true)
          }
        })
        .catch(err => {
          if (err instanceof ApiError && err.response.code !== 'UNKNOWN') {
            toastError(err.response.message || 'Failed to verify security questions')
          } else {
            toastError('Failed to verify security questions')
          }
        })
        .finally(() => toggleLoading(false))
    }
  }

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    if (verified) {
      resetPassword()
      return
    }

    verifySecurityQuestions()
  }

  useOnEnter(formRef, handleSubmit)

  const renderSecurityQuestionsContent = () => {
    return (
      <>
        <div className="user-input-group px-2 lg:px-3">
          <div className="user-input-label">Your email *</div>
          <CoreTextInput
            type={CoreTextInputType.EMAIL}
            placeholder="Email"
            value={email}
            setValue={setEmail}
            autoFocus
            autoComplete="email"
            showClearIcon
            onClearClick={() => setEmail('')}
            inputClassName={classnames('user-input', {
              'user-input-error': invalidField.EMAIL,
            })}
          />
        </div>

        <hr className="mx-2 lg:mx-3 text-gray300 py-2" />

        {defaultQuestionsList.map(index => {
          if (!questionsState[index]) {
            return null
          }

          const options = allQuestions.map(question => ({
            id: question.id,
            label: question.question,
            value: question.id.toString(),
            selected: false,
          }))

          return (
            <div className="user-input-group px-2 lg:px-3" key={index}>
              <div className="user-input-label">Question {index} *</div>
              <CoreSelectInput
                value={questionsState[index].questionId?.toString() || ''}
                onChange={value => updateQuestionsState(index, Number(value), undefined)}
                options={options}
              />
              <CoreTextInput
                type={CoreTextInputType.TEXT}
                placeholder="Answer"
                value={questionsState[index].answer}
                setValue={value => updateQuestionsState(index, undefined, value)}
                autoComplete="off"
                inputClassName={classnames('user-input mt-1')}
                maxLength={40}
              />
            </div>
          )
        })}
      </>
    )
  }

  const renderResetPasswordContent = () => {
    return (
      <>
        <div className="user-input-group px-2 lg:px-3">
          <div className="user-input-label">New Password *</div>
          <CoreTextInput
            type={CoreTextInputType.PASSWORD}
            placeholder="Password"
            value={newPassword}
            setValue={setNewPassword}
            autoComplete="password"
            autoFocus
            inputClassName={classnames('user-input', {
              'user-input-error': invalidField.NEW_PASSWORD,
            })}
          />
        </div>
        <div className="user-input-group px-2 lg:px-3">
          <div className="user-input-label">Confirm New Password *</div>
          <CoreTextInput
            type={CoreTextInputType.PASSWORD}
            placeholder="Confirm Password"
            value={confirmNewPassword}
            setValue={setConfirmNewPassword}
            autoComplete="off"
            inputClassName={classnames('user-input', {
              'user-input-error': invalidField.CONFIRM_NEW_PASSWORD,
            })}
          />
        </div>
      </>
    )
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: dismissModal,
        title: verified ? 'Reset Password' : 'Answer security questions',
        disableOutsideClick: true,
      }}
      footer={{
        buttons: [
          {
            label: verified ? 'Back' : 'Cancel',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_SECONDARY,
            onClick: () => {
              verified ? toggleVerified(false) : dismissModal()
            },
          },
          {
            label: verified ? 'Reset password' : 'Verify',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_PRIMARY,
            className: 'ml-1',
            loading: loading,
            disabled: !allQuestions.length,
            onClick: handleSubmit,
          },
        ],
      }}>
      <div className="pt-4">
        {!allQuestions.length ? (
          <div className="">
            <Loader type={LoaderType.ELLIPSIS} />
          </div>
        ) : (
          <div ref={formRef}>{verified ? renderResetPasswordContent() : renderSecurityQuestionsContent()}</div>
        )}
      </div>
    </FullWidthModal>
  )
}

export default AnswerSecurityQuestionsModal
