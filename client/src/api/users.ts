import { rootURL } from './index'
interface Credential {
  email: string
  password: string
}

interface ReturnedLoginData {
  success: boolean
  user: {
    id: string
    expireAt: number
  }
}
const loginUser = async (
  credential: Credential
): Promise<ReturnedLoginData> => {
  const response = await fetch(`${rootURL}/users/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(credential),
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

const logoutUser = async (): Promise<{ success: boolean }> => {
  const response = await fetch(`${rootURL}/users/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  const data = await response.json()
  console.log('data-logout: ', data)
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

export default { loginUser, logoutUser }
