import { createContext, useState, Dispatch, useEffect } from 'react'

interface userContextProps {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>
}

interface UserContextProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const userContext = createContext<userContextProps>(
  {} as userContextProps
)

export default function UserContextProvider({
  children,
}: UserContextProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const checkIsAuthenticated = () => {
    const data = localStorage.getItem('sas-short')
    if (!data) return
    const today = new Date()
    const { expireAt } = JSON.parse(data)
    if (today.getTime() > expireAt) return localStorage.removeItem('sas-short')
    setIsAuthenticated(true)
  }

  const data = {
    isAuthenticated,
    setIsAuthenticated,
  }

  useEffect(() => {
    checkIsAuthenticated()
  }, [isAuthenticated])

  return <userContext.Provider value={data}>{children}</userContext.Provider>
}
