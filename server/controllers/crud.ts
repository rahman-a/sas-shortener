import fs from 'fs'
import fsPromise from 'fs/promises'
import path from 'path'

const __dirname = path.resolve()

const filePath = path.join(__dirname, 'server', 'data', 'urls.json')
const userFilePath = path.join(__dirname, 'server', 'data', 'users.json')

interface URL {
  destination?: string
  short?: string
  clicks?: number
  createdAt?: string
  updatedAt?: string
}

interface SortUrls {
  createdAt?: string
  clicks?: string
  page?: number
}

// create a function to shorten a url
export const shortenUrl = async (url: URL): Promise<URL> => {
  const { destination, short } = url
  if (!destination || !short) {
    throw new Error('Missing destination or short')
  }
  const newUrl = {
    destination,
    short,
    clicks: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  let urls: URL[] = []
  if (fs.existsSync(filePath)) {
    urls = JSON.parse(await fsPromise.readFile(filePath, 'utf-8'))
  }
  await fsPromise.writeFile(filePath, JSON.stringify([...urls, newUrl]))
  return newUrl
}
export const getOneUrl = async (url: URL): Promise<URL | undefined> => {
  const { destination, short } = url
  const urls = await fsPromise.readFile(filePath, 'utf-8')
  const parsedUrls = JSON.parse(urls)
  let foundUrl = undefined
  if (url.destination) {
    foundUrl = parsedUrls.find((url: URL) => url.destination === destination)
  }
  if (url.short) {
    foundUrl = parsedUrls.find((url: URL) => url.short === short)
  }
  return foundUrl
}
// create a function to get all urls
export const getAllUrls = async (sort: SortUrls): Promise<URL[]> => {
  if (!sort.createdAt) sort.createdAt = 'asc'
  if (!sort.page) sort.page = 1
  const urlsPerPage = 10
  const skip = (sort.page - 1) * urlsPerPage
  const urls = await fsPromise.readFile(filePath, 'utf-8')
  let parsedUrls = JSON.parse(urls)
  parsedUrls = parsedUrls.slice(skip, skip + urlsPerPage)
  // sort urls based on date
  if (sort.createdAt === 'asc') {
    parsedUrls.sort((a: URL, b: URL) => {
      const dateA = new Date(a.createdAt!)
      const dateB = new Date(b.createdAt!)
      return dateB.getTime() - dateA.getTime()
    })
  }

  if (sort.createdAt === 'desc') {
    parsedUrls.sort((a: URL, b: URL) => {
      const dateA = new Date(a.createdAt!)
      const dateB = new Date(b.createdAt!)
      return dateA.getTime() - dateB.getTime()
    })
  }

  if (sort.clicks === 'asc') {
    parsedUrls.sort((a: URL, b: URL) => {
      return a.clicks! - b.clicks!
    })
  }
  if (sort.clicks === 'desc') {
    parsedUrls.sort((a: URL, b: URL) => {
      return b.clicks! - a.clicks!
    })
  }
  return parsedUrls
}

// create a function to update a url clicks count
export const updateUrlClicks = async (short: string): Promise<URL> => {
  const urls = await fsPromise.readFile(filePath, 'utf-8')
  const parsedUrls = JSON.parse(urls)
  let foundUrl = parsedUrls.find((url: URL) => url.short === short)
  if (!foundUrl) throw new Error('Url not found')
  const newUrls = parsedUrls.map((url: URL) => {
    if (url.short === short) {
      url.clicks = url.clicks! + 1
      url.updatedAt = new Date().toISOString()
      foundUrl = url
    }
    return url
  })
  await fsPromise.writeFile(filePath, JSON.stringify(newUrls))
  return foundUrl
}

// create a function to delete a url
export const deleteUrl = async (short: string): Promise<URL> => {
  const urls = await fsPromise.readFile(filePath, 'utf-8')
  const parsedUrls = JSON.parse(urls)
  const foundUrl = parsedUrls.find((url: URL) => url.short === short)
  if (!foundUrl) throw new Error('Url not found')
  const newUrls = parsedUrls.filter((url: URL) => url.short !== short)
  await fsPromise.writeFile(filePath, JSON.stringify(newUrls))
  return foundUrl
}

// create a function to filter urls bases on destination , short and clicks
export const filterUrls = async (url: URL): Promise<URL[]> => {
  const { destination, short, clicks } = url
  const urls = await fsPromise.readFile(filePath, 'utf-8')
  const parsedUrls = JSON.parse(urls)
  const filteredUrls = parsedUrls.filter((url: URL) => {
    if (destination && short && clicks) {
      return (
        url.destination!.includes(destination) &&
        url.short!.includes(short) &&
        url.clicks === Number(clicks)
      )
    }
    if (destination && short) {
      return (
        url.destination!.includes(destination) && url.short!.includes(short)
      )
    }
    if (destination && clicks) {
      return (
        url.destination!.includes(destination) && url.clicks === Number(clicks)
      )
    }
    if (short && clicks) {
      return url.short!.includes(short) && url.clicks === Number(clicks)
    }
    if (destination) {
      return url.destination!.includes(destination)
    }
    if (short) {
      return url.short!.includes(short)
    }
    if (clicks) {
      return url.clicks === Number(clicks)
    }
  })
  return filteredUrls
}

export const getUser = async (member: {
  email?: string
  _id?: string
}): Promise<any> => {
  const users = await fsPromise.readFile(userFilePath, 'utf-8')
  const parsedUsers = JSON.parse(users)
  const foundUser = member.email
    ? parsedUsers.find((user: any) => user.email === member.email)
    : parsedUsers.find((user: any) => user._id === member._id)
  return foundUser
}
