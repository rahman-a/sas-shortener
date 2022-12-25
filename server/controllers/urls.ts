import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { nanoid } from 'nanoid'
import URL from '../models/urls.js'
import { validateUrl } from '../util/utils.js'
import path from 'path'

interface UrlQuery {
  original_url?: string
  shortId?: string
  page?: string
  clicks?: string
  createdAt?: 'asc' | 'desc'
  count?: 'asc' | 'desc'
}

//  create new short url
export const createShortUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { original_url } = req.body
    if (!original_url) {
      throw new Error('Please enter a url to shorten')
    }
    if (!validateUrl(original_url)) {
      throw new Error('Please enter a valid url')
    }
    const isUrlFound = await URL.findOne({ original_url })
    if (isUrlFound) {
      throw new Error('URL already found, please choose another url')
    }
    const BASE_URL =
      process.env.NODE_ENV === 'production'
        ? `${req.protocol}://${req.hostname}`
        : `${req.protocol}://${req.hostname}:${process.env.PORT}`

    const shortId = nanoid(7)
    const newUrl = {
      shortId,
      original_url,
      short_url: `${BASE_URL}/${shortId}`,
      clicks: 0,
    }

    const newCreatedUrl = await URL.create(newUrl)
    res.status(201).json({
      success: true,
      url: newCreatedUrl,
    })
  }
)

// get all urls
export const getAllShortUrls = asyncHandler(
  async (req: Request, res: Response) => {
    const { createdAt, clicks, page, shortId, original_url, count }: UrlQuery =
      req.query
    let query: any = {}
    if (clicks) query['clicks'] = Number(clicks)
    if (shortId) query['shortId'] = shortId
    if (original_url)
      query['original_url'] = { $regex: original_url, $options: 'i' }
    const sort: any = {}
    if (createdAt) sort['createdAt'] = createdAt
    if (count) sort['clicks'] = count
    const skip = page ? (Number(page) - 1) * 10 : 0
    const urls = await URL.find(query).limit(10).skip(skip).sort(sort)
    res.status(200).json({
      success: true,
      urls,
    })
  }
)

// get one url by id
export const getShortUrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const url = await URL.findById(id)
  if (!url) {
    throw new Error('Url not found')
  }
  res.status(200).json({
    success: true,
    url,
  })
})

// delete url by id
export const deleteShortUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const isFoundUrl = await URL.findById(id)
    if (!isFoundUrl) {
      throw new Error('Url not found')
    }
    const url = await isFoundUrl.remove()
    res.status(200).json({
      success: true,
      url,
      message: 'Url removed',
    })
  }
)

export const requestShortUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { short } = req.params
    const url = await URL.findOne({ shortId: short })
    if (!url) {
      res.sendFile(path.join(process.cwd(), 'server', 'views', '404.html'))
      return
    } else {
      await updateShortUrlClicks(short)
      res.redirect(url.original_url!)
    }
  }
)

async function updateShortUrlClicks(short: string) {
  return await URL.findOneAndUpdate({ shortId: short }, { $inc: { clicks: 1 } })
}
