import { useReducer, useEffect } from 'react'
import { uniqListOfObjects } from '../utils/common'

export interface IInfiniteScrollState {
  offset: number
  hasMore: boolean
  loading: boolean
  data: any[]
}

interface SuccessAction {
  data: any[]
  offset: number
  loading?: boolean
  getuniqListKey?: (data: any) => any // If you want to remove duplicate data obj, the provide the key
  shouldReplace?: boolean
  hasMore?: boolean
  extra?: any
  checkUniqueOffset?: boolean
  shouldPrepend?: boolean
}

type Action =
  | {
      type: 'success'
      payload: SuccessAction
    }
  | {
      type: 'limit_reached'
    }
  | {
      type: 'error'
      payload?: any
    }
  | {
      type: 'update'
      payload: any
    }

const reducer = (state: IInfiniteScrollState, action: Action) => {
  switch (action.type) {
    case 'success':
      const {
        data,
        offset,
        loading,
        getuniqListKey,
        shouldReplace = false,
        hasMore = true,
        extra,
        checkUniqueOffset = false,
        shouldPrepend = false,
      } = action.payload

      const mergedList = shouldReplace ? data : shouldPrepend ? [...data, ...state.data] : [...state.data, ...data]

      if (checkUniqueOffset && state.offset === offset) {
        return state
      }

      return {
        data: getuniqListKey ? uniqListOfObjects(getuniqListKey)(mergedList) : mergedList,
        offset,
        hasMore: hasMore,
        ...(extra && { extra }),
        loading: loading === undefined ? state.loading : loading,
      }

    case 'limit_reached':
      return {
        ...state,
        hasMore: false,
        loading: loading === undefined ? state.loading : loading,
      }

    case 'error':
      return {
        ...state,
        hasMore: false,
        ...action.payload,
      }

    case 'update':
      return {
        ...state,
        ...action.payload,
      }

    default:
      break
  }
}

interface Options {
  initialState: {
    data: any[]
    [key: string]: any
  }
  resetStateDependencies?: any[]
}

const useInfiniteScroll = ({ initialState, resetStateDependencies = [] }: Options) => {
  const _initialState = {
    data: initialState.data,
    offset: 0,
    hasMore: true,
    loading: false,
    ...initialState,
  }

  const [state, dispatch] = useReducer(reducer, _initialState)

  useEffect(() => {
    dispatch({
      type: 'update',
      payload: initialState,
    })
  }, resetStateDependencies)

  return {
    scrollState: state,
    scrollDispatch: dispatch,
  }
}

export default useInfiniteScroll
