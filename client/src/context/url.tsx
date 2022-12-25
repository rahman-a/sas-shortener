import { createContext, useContext, useReducer, Dispatch } from 'react'

export interface URL {
  _id: string
  original_url: string
  shortId: string
  short_url: string
  clicks: number
  createdAt: string
  updatedAt: string
}

interface ContextProps {
  urls: URL[]
}

export enum ActionType {
  SHORTEN_URL = 'SHORTEN_URL',
  DELETE_URL = 'DELETE_URL',
  GET_URLS = 'GET_URLS',
  INCREASE_CLICKS = 'INCREASE_CLICKS',
}

type Action =
  | { type: ActionType.GET_URLS; payload: URL[] }
  | { type: ActionType.DELETE_URL; payload: string }
  | { type: ActionType.SHORTEN_URL; payload: URL }
  | { type: ActionType.INCREASE_CLICKS; payload: string }

interface URLContextType {
  state: ContextProps
  dispatch: Dispatch<Action>
}

interface URLContextProviderProps {
  children: JSX.Element | JSX.Element[]
}

const reducer = (state: ContextProps, action: Action) => {
  switch (action.type) {
    case ActionType.GET_URLS:
      return { ...state, urls: action.payload }
    case ActionType.DELETE_URL:
      return {
        ...state,
        urls: state.urls.filter((url) => url._id !== action.payload),
      }
    case ActionType.SHORTEN_URL:
      return { ...state, urls: [action.payload, ...state.urls] }
    case ActionType.INCREASE_CLICKS:
      return {
        ...state,
        urls: state.urls.map((url) =>
          url._id === action.payload ? { ...url, clicks: url.clicks + 1 } : url
        ),
      }
    default:
      return state
  }
}

const urlContext = createContext<URLContextType>({
  state: { urls: [] } as ContextProps,
  dispatch: () => null,
})

export const useURLContext = () => useContext(urlContext)

export default function URLContextProvider({
  children,
}: URLContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, { urls: [] } as ContextProps)
  return (
    <urlContext.Provider value={{ state, dispatch }}>
      {children}
    </urlContext.Provider>
  )
}
