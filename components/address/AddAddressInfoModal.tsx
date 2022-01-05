import React, { useContext, useEffect, useRef, useState } from 'react'
import { REGEX_MAP } from '../../constants/constants'
import { UserAddressType } from '../../contract/constants'
import { IUserAddressInfo } from '../../contract/address'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreCheckbox from '../core/CoreCheckbox'
import CoreDivider from '../core/CoreDivider'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import CoreRadio from '../core/CoreRadio'
import Modal from '../modal/Modal'
import classnames from 'classnames'
import useOnEnter from '../../hooks/useOnEnter'
import CoreSelectInput from '../core/CoreSelectInput'
import { getCitySelectOptions, getCountrySelectOptions } from '../../utils/supportedRegions'
import ApplicationContext from '../ApplicationContext'
import { toastError } from '../Toaster'
import Loader, { LoaderType } from '../loader/Loader'
import FullWidthModal from '../modal/FullWidthModal'

interface IAddAddressInfoProps {
  address?: IUserAddressInfo
  dismiss: () => void
  title: string
  cta: {
    primary: {
      show: boolean
      label?: string
      loading?: boolean
      onClick?: (address: IUserAddressInfo) => void
    }
    secondary: {
      show: boolean
      label?: string
      onClick?: (address: IUserAddressInfo) => void
    }
  }
}

interface IState extends IUserAddressInfo {}

const AddAddressInfoModal: React.FC<IAddAddressInfoProps> = props => {
  const { dismiss, address, title, cta } = props

  const defaultAddress: IState = {
    id: null,
    name: '',
    phoneNumber: '',
    addressLine: '',
    area: '',
    areaCode: null,
    city: '',
    country: '',
    isPrimary: false,
    isActive: false,
    addressType: UserAddressType.NONE,
  }

  const applicationContext = useContext(ApplicationContext)
  const { supportedRegions } = applicationContext

  const [state, setState] = useState<IState>(address ? address : defaultAddress)
  const [fieldsWithError, setFieldsWithError] = useState({
    NAME: false,
    PHONE_NUMBER: false,
    ADDRESS_LINE: false,
    AREA: false,
    AREA_CODE: false,
    CITY: false,
    COUNTRY: false,
    ADDRESS_TYPE: false,
  })

  const formRef = useRef(null)
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [])

  const updateField = (key: keyof IState, value: any) => {
    setState({
      ...state,
      [key]: value,
    })
  }

  const FIELD_VALIDATION_MAPPING = {
    NAME: {
      regex: REGEX_MAP.NAME,
      error: 'Invalid name (must be between 3-50 letters)',
      value: state.name,
      key: 'NAME',
      optional: false,
    },
    PHONE_NUMBER: {
      regex: REGEX_MAP.PHONE_NUMBER,
      error: 'Invalid phone number',
      value: state.phoneNumber,
      key: 'PHONE_NUMBER',
      optional: false,
    },
    ADDRESS_LINE: {
      regex: REGEX_MAP.ADDRESS_LINE,
      error: 'Address line (must be less than 100 letters)',
      value: state.addressLine,
      key: 'ADDRESS_LINE',
      optional: false,
    },
    AREA: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid locality',
      value: state.area,
      key: 'AREA',
      optional: false,
    },
    AREA_CODE: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid area code',
      value: state.areaCode?.toString(),
      key: 'AREA_CODE',
      optional: true,
    },
    CITY: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid city',
      value: state.city,
      key: 'CITY',
      optional: false,
    },
    COUNTRY: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid country',
      value: state.country,
      key: 'COUNTRY',
      optional: false,
    },
    ADDRESS_TYPE: {
      regex: REGEX_MAP.ADDRESS_TYPE,
      error: 'Invalid address type',
      value: state.addressType,
      key: 'ADDRESS_TYPE',
      optional: false,
    },
  }

  const handleSubmit = () => {
    const validatedFields = Object.values(FIELD_VALIDATION_MAPPING).map(field => {
      let valid = false

      if (!field.optional) {
        valid = field.regex.test(field.value)
      } else {
        if (field.value) {
          valid = field.regex.test(field.value)
        } else {
          valid = true
        }
      }

      return {
        ...field,
        valid: valid,
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
      cta.primary.onClick(state)
    }
  }

  useOnEnter(formRef, handleSubmit)

  const renderLoader = () => {
    return (
      <div className="p-4">
        <Loader type={LoaderType.ELLIPSIS} className="mb-14" />
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div className="mt-3 lg:mt-5">
        <div className="user-input-group userInputGroupAddAddress px-3 lg:px-4">
          <div className="user-input-label">Name *</div>
          <CoreTextInput
            ref={nameInputRef}
            type={CoreTextInputType.TEXT}
            placeholder="Name"
            value={state.name}
            setValue={value => updateField('name', value)}
            autoComplete="name"
            autoFocus
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.NAME,
            })}
            maxLength={35}
          />
        </div>
        <div className="user-input-group userInputGroupAddAddress px-3 lg:px-4">
          <div className="user-input-label">Phone Number *</div>
          <div className="text-sm relative -top-2">Along with country code</div>
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Phone"
            value={state.phoneNumber}
            setValue={value => updateField('phoneNumber', value)}
            autoComplete="tel"
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.PHONE_NUMBER,
            })}
          />
        </div>

        <CoreDivider className="my-2 lg:my-8" />

        <div className="user-input-group userInputGroupAddAddress px-3 lg:px-4">
          <div className="user-input-label">Address *</div>
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Address (House No, Building, Street, Area)"
            value={state.addressLine}
            setValue={value => updateField('addressLine', value)}
            autoComplete="street-address"
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.ADDRESS_LINE,
            })}
            maxLength={100}
          />
        </div>
        <div className="user-input-group userInputGroupAddAddress px-3 lg:px-4">
          <div className="user-input-label">Locality *</div>
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Locality/ Town"
            value={state.area}
            setValue={value => updateField('area', value)}
            autoComplete="off"
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.AREA,
            })}
            maxLength={50}
          />
        </div>
        <div className="user-input-group userInputGroupAddAddress px-3 lg:px-4">
          <div className="user-input-label">Area Code</div>
          <CoreTextInput
            type={CoreTextInputType.NUMBER}
            placeholder="Code"
            value={state.areaCode?.toString()}
            setValue={value => updateField('areaCode', value)}
            autoComplete="postal-code"
            inputClassName={classnames('user-input', {
              'user-input-error': fieldsWithError.AREA_CODE,
            })}
            maxLength={20}
          />
        </div>
        <div className="user-input-group userInputGroupAddAddress px-3 lg:px-4">
          <div className="user-input-label">City *</div>

          {supportedRegions.cities.length > 0 ? (
            <CoreSelectInput
              value={state.city}
              onChange={value => updateField('city', value)}
              options={getCitySelectOptions(supportedRegions)}
              className={classnames({
                'user-input-error': fieldsWithError.CITY,
              })}
            />
          ) : (
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="City/ District"
              value={state.city}
              setValue={value => updateField('city', value)}
              autoComplete="address-level2"
              inputClassName={classnames('user-input', {
                'user-input-error': fieldsWithError.CITY,
              })}
            />
          )}
        </div>
        <div className="user-input-group userInputGroupAddAddress px-3 lg:px-4">
          <div className="user-input-label">Country *</div>
          {supportedRegions.countries.length > 0 ? (
            <CoreSelectInput
              value={state.country}
              onChange={value => updateField('country', value)}
              options={getCountrySelectOptions(supportedRegions)}
              className={classnames({
                'user-input-error': fieldsWithError.COUNTRY,
              })}
            />
          ) : (
            <CoreTextInput
              type={CoreTextInputType.TEXT}
              placeholder="Country"
              value={state.country}
              setValue={value => updateField('country', value)}
              autoComplete="country-name"
              inputClassName={classnames('user-input', {
                'user-input-error': fieldsWithError.COUNTRY,
              })}
            />
          )}
        </div>

        <CoreDivider className="my-2 lg:my-8" />

        <div className="px-3 py-2 lg:px-4">
          <div className="text-primaryTextBold font-medium font-primary-medium mb-2">Type of Address *</div>
          <div className="flex">
            <CoreRadio
              id="home"
              onChange={value => updateField('addressType', value)}
              value={UserAddressType.HOME}
              label="Home"
              checked={state.addressType === UserAddressType.HOME}
              className="mr-6"
            />
            <CoreRadio
              id="work"
              onChange={value => updateField('addressType', value)}
              value={UserAddressType.WORK}
              label="Work"
              checked={state.addressType === UserAddressType.WORK}
              className="mr-6"
            />
            <CoreRadio
              id="other"
              onChange={value => updateField('addressType', value)}
              value={UserAddressType.OTHER}
              label="Other"
              checked={state.addressType === UserAddressType.OTHER}
            />
          </div>
        </div>

        <div className="px-3 lg:px-4">
          <div className="border-t border-gray300 my-3" />
        </div>

        <div className="py-2 px-3 lg:px-4">
          <CoreCheckbox
            id="primary"
            onChange={value => updateField('isPrimary', value)}
            checked={state.isPrimary}
            label="Make this as my default address"
          />
        </div>
      </div>
    )
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: dismiss,
        showCrossIcon: true,
        title: title,
        disableOutsideClick: true,
      }}
      footer={{
        buttons: [
          {
            label: cta.secondary.label,
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_SECONDARY,
            onClick: () => cta.secondary.onClick(state),
          },
          {
            label: cta.primary.label,
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_PRIMARY,
            onClick: handleSubmit,
            className: 'ml-1',
            loading: cta.primary.loading,
          },
        ],
      }}>
      {supportedRegions ? renderContent() : renderLoader()}
    </FullWidthModal>
  )
}

export default AddAddressInfoModal
