import React, { useContext, useEffect, useRef, useState } from 'react'
import { IUserSecurityQuestionsDetail } from '../../contract/security'
import useOnEnter from '../../hooks/useOnEnter'
import { getSessionSecurityQuestionsDetail, updateUserSecurityQuestionAnswers } from '../../http/security'
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
import { REGEX_MAP } from '../../constants/constants'
import ApiError from '../../error/ApiError'
import { ISecurityAnswerInfo } from '../../contract/security'
import appConfig from '../../config/appConfig'
import FullWidthModal from '../modal/FullWidthModal'

interface IUpdateSecurityQuestionsModalProps {
  dismissModal: () => void
}

const UpdateSecurityQuestionsModal: React.FC<IUpdateSecurityQuestionsModalProps> = props => {
  const { dismissModal } = props

  const applicationContext = useContext(ApplicationContext)
  const { user, setting } = applicationContext

  const formRef = useRef(null)

  const [detail, setDetail] = useState<IUserSecurityQuestionsDetail>(null)
  const [loading, toggleLoading] = useState(false)
  const [questionsState, setQuestionsState] = useState<Record<number, ISecurityAnswerInfo>>({})
  const [password, setPassword] = useState('')
  const [invalidPassword, setInvalidPassword] = useState(false)

  const MAX_QUESTIONS_ALLOWED = appConfig.global.minSecurityQuestions

  const defaultQuestionsList = [...Array(3).keys()].map(e => e + 1)

  useEffect(() => {
    getSessionSecurityQuestionsDetail()
      .then(resp => {
        setDetail(resp)
      })
      .catch(console.error)
  }, [])

  const getInitialState = () => {
    if (detail.answeredQuestions.length) {
      return detail.answeredQuestions.slice(0, MAX_QUESTIONS_ALLOWED).reduce((acc, cur, curIndex) => {
        acc[curIndex + 1] = {
          questionId: cur.question.id,
          answer: '',
        }
        return acc
      }, {})
    }

    return defaultQuestionsList.reduce((acc, cur) => {
      acc[cur] = {
        questionId: '',
        answer: '',
      }
      return acc
    }, {})
  }

  useEffect(() => {
    if (detail) {
      setQuestionsState(getInitialState())
    }
  }, [detail])

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

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const questionsStateInvalid = Object.values(questionsState).some(s => !s.answer)
    const invalidPassword = !REGEX_MAP.PASSWORD.test(password)

    if (invalidPassword) {
      toastError('Invalid password')
      setInvalidPassword(true)
    } else if (questionsStateInvalid) {
      toastError(`Minimum ${MAX_QUESTIONS_ALLOWED} answers are required`)
    } else {
      toggleLoading(true)

      updateUserSecurityQuestionAnswers({
        password: password,
        securityAnswers: Object.values(questionsState) as any,
      })
        .then(resp => {
          if (resp.success) {
            toastSuccess('Updated successfully')
            applicationContext.updaters.updateSetting({
              ...setting,
              securityQuestionsSet: true,
            })
            appAnalytics.sendEvent({
              action: AnalyticsEventType.UPDATE_SECURITY_QUESTIONS,
            })
            dismissModal()
          }
        })
        .catch(err => {
          if (err instanceof ApiError && err.response.code !== 'UNKNOWN') {
            toastError(err.response.message || 'Failed to update security questions')
          } else {
            toastError('Failed to update security questions')
          }
        })
        .finally(() => toggleLoading(false))
    }
  }

  useOnEnter(formRef, handleSubmit)

  return (
    <FullWidthModal
      modal={{
        dismissModal: dismissModal,
        title: setting.securityQuestionsSet ? 'Update security questions' : 'Set security questions',
        disableOutsideClick: true,
      }}
      footer={{
        buttons: [
          {
            label: 'Cancel',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_SECONDARY,
            onClick: () => dismissModal(),
          },
          {
            label: 'Update',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_PRIMARY,
            className: 'ml-1',
            loading: loading,
            onClick: handleSubmit,
            disabled: isEmptyObject(questionsState),
          },
        ],
      }}>
      {isEmptyObject(questionsState) ? (
        <div className="p-4">
          <Loader type={LoaderType.ELLIPSIS} />
        </div>
      ) : (
        <div ref={formRef} className="pt-2">
          <div className="user-input-group px-2 lg:px-3 xl:px-4">
            <div className="user-input-label">Current Password *</div>
            <CoreTextInput
              type={CoreTextInputType.PASSWORD}
              placeholder="Password"
              value={password}
              setValue={setPassword}
              autoFocus
              inputClassName={classnames('user-input', {
                'user-input-error': invalidPassword,
              })}
            />
          </div>

          <hr className="mx-2 lg:mx-3 text-gray300 py-2" />

          {defaultQuestionsList.map(index => {
            if (!questionsState[index]) {
              return null
            }

            const options =
              detail?.allQuestions.map(question => ({
                id: question.id,
                label: question.question,
                value: question.id.toString(),
                selected: detail?.answeredQuestions.some(answer => answer.question.id === question.id),
              })) || []

            return (
              <div className="user-input-group px-2 lg:px-3" key={index}>
                <div className="user-input-label">Question {index} *</div>
                <CoreSelectInput
                  value={questionsState[index].questionId?.toString()}
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
        </div>
      )}
    </FullWidthModal>
  )
}

export default UpdateSecurityQuestionsModal
