const roles = [
  {
    role: 'manage_urls',
    code: 'EG85T',
  },
  {
    role: 'manage_offices',
    code: 'EF79V',
  },
  {
    role: 'manage_contacts',
    code: 'DR45F',
  },
  {
    role: 'manage_jobs',
    code: 'QB13D',
  },
  {
    role: 'manage_users',
    code: 'FR42H',
  },
]

export function getQueryString(queries: any) {
  const queriesData = {} as any
  for (const key in queries) {
    if (queries[key]) {
      queriesData[key] = queries[key]
    }
  }
  return Object.keys(queriesData).length > 0
    ? '?' + new URLSearchParams({ ...queriesData }).toString()
    : ''
}

export const isAuthorized = (userRoles: { code: string }[], role: string) => {
  if (!userRoles || userRoles.length === 0) return false
  const code = roles.find((r) => r.role === role)?.code
  return userRoles.find((r) => r.code === code) ? true : false
}
