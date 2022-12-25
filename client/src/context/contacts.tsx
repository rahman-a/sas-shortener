import { createContext, useReducer, useContext } from 'react'
import type { Contact } from '../types'

interface ContactsState {
  contacts: Contact[]
}

interface ContactsContextProps {
  state: ContactsState
  dispatch: React.Dispatch<Actions>
}

export enum ActionTypes {
  GET_CONTACTS = 'GET_CONTACTS',
  DELETE_CONTACT = 'DELETE_CONTACT',
}

type Actions =
  | {
      type: ActionTypes.GET_CONTACTS
      payload: Contact[]
    }
  | {
      type: ActionTypes.DELETE_CONTACT
      payload: string
    }

interface ContactsProviderProps {
  children: JSX.Element | JSX.Element[]
}

const contactsContext = createContext<ContactsContextProps>({
  state: { contacts: [] } as ContactsState,
  dispatch: (action: Actions) => null,
})

export const useContacts = () => useContext(contactsContext)

const contactsReducer = (state: ContactsState, action: Actions) => {
  switch (action.type) {
    case ActionTypes.GET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      }
    case ActionTypes.DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact._id !== action.payload
        ),
      }
    default:
      return state
  }
}

export default function ContactsProvider({ children }: ContactsProviderProps) {
  const [state, dispatch] = useReducer(contactsReducer, {
    contacts: [],
  } as ContactsState)

  return (
    <contactsContext.Provider value={{ state, dispatch }}>
      {children}
    </contactsContext.Provider>
  )
}
