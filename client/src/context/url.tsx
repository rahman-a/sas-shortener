import { createContext, useContext, useReducer, Dispatch } from 'react'

export interface URL {
  destination: string
  short: string
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
}

type Action =
  | { type: ActionType.GET_URLS; payload: URL[] }
  | { type: ActionType.DELETE_URL; payload: string }
  | { type: ActionType.SHORTEN_URL; payload: URL }

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
        urls: state.urls.filter((url) => url.short !== action.payload),
      }
    case ActionType.SHORTEN_URL:
      return { ...state, urls: [action.payload, ...state.urls] }
    default:
      return state
  }
}

const urlContext = createContext<URLContextType>({
  state: {} as ContextProps,
  dispatch: () => null,
})

export const useURLContext = () => useContext(urlContext)

export default function URLContextProvider({
  children,
}: URLContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, {} as ContextProps)
  return (
    <urlContext.Provider value={{ state, dispatch }}>
      {children}
    </urlContext.Provider>
  )
}
