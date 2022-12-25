import { createContext, useState, Dispatch, useContext } from 'react'

type Role = { code: string }

interface userContextProps {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>
  roles: Role[]
}

interface UserContextProviderProps {
  children: JSX.Element | JSX.Element[]
}

const userContext = createContext<userContextProps>({} as userContextProps)

export const useUserContext = () => useContext(userContext)

const checkIsAuthenticated = (): boolean => {
  const data = localStorage.getItem('sas-short')
  if (!data) return false
  const today = new Date()
  const { expireAt } = JSON.parse(data)
  if (today.getTime() > expireAt) {
    localStorage.removeItem('sas-short')
    return false
  }
  return true
}

export default function UserContextProvider({
  children,
}: UserContextProviderProps) {
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(checkIsAuthenticated)

  const data = {
    isAuthenticated,
    setIsAuthenticated,
    roles: JSON.parse(localStorage.getItem('sas-short')!)?.rl,
  }

  return <userContext.Provider value={data}>{children}</userContext.Provider>
}
