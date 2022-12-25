import { FormEvent, useEffect, useState } from 'react'
import {
  Flex,
  Box,
  IconButton,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Select,
  Button,
} from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import { useInfiniteQuery } from 'react-query'
import { Helmet } from 'react-helmet-async'
import Shortener from '../components/URLs/Shortener'
import ContentTable from '../components/URLs/Url-Table'
import ContentCards from '../components/URLs/Url-Cards'
import FilterData from '../components/URLs/Filter-Data'
import NotAuth from '../components/Not-Auth'
import { useUserContext } from '../context/user'
import { isAuthorized } from '../utils'
import { Filter, Click, Calendar } from '../assets/icons'
import api from '../api'
import { useURLContext, ActionType } from '../context/url'
import { Arrange, URLsQueries } from '../types'

type QueryKey = {
  [key in 'createdAt' | 'count']: string
}

const LinkShortener = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [queries, setQueries] = useState<URLsQueries>({} as URLsQueries)
  const { state, dispatch } = useURLContext()
  const { roles } = useUserContext()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['urls', { ...queries }], api.getUrls, {
    enabled: state.urls?.length === 0 || Object.keys(queries).length > 0,
    staleTime: Infinity,
    keepPreviousData: true,
    getNextPageParam: (lastPage, pages) =>
      lastPage.urls.length ? pages.length + 1 : undefined,
  })

  const refineQueryData = (data: any) => {
    if (!data) return []
    const refinedData = data.pages.map((page: any) => page.urls)
    return refinedData.flat()
  }

  const resetHandler = () => {
    setQueries({})
  }

  if (!isAuthorized(roles, 'manage_urls')) {
    return <NotAuth title='URL Shortener' header='URLs Shortener Panel' />
  }

  const Component = () => {
    if (status === 'loading') {
      return <Spinner size='xl' />
    }
    if (status === 'error') {
      return (
        <Alert status='error' display='flex' justifyContent='center'>
          <AlertIcon />
          <AlertDescription>
            Something went wrong, please refresh the page
          </AlertDescription>
        </Alert>
      )
    }
    if (refineQueryData(data).urls?.length === 0) {
      return (
        <Alert status='info' display='flex' justifyContent='center'>
          <AlertIcon />
          <AlertTitle>No Urls Found</AlertTitle>
        </Alert>
      )
    }

    return (
      state.urls?.length > 0 && (
        <>
          <ContentTable />
          <ContentCards />
        </>
      )
    )
  }

  useEffect(() => {
    data &&
      dispatch({ type: ActionType.GET_URLS, payload: refineQueryData(data) })
  }, [data])
  return (
    <>
      <Helmet>
        <title>URL Shortener</title>
      </Helmet>
      <FilterData
        isOpen={isOpen}
        onClose={onClose}
        queries={queries as URLsQueries}
        setQueries={setQueries}
      />
      <Flex
        width='100%'
        flexGrow='1'
        justifyContent='start'
        alignItems={status === 'loading' ? 'center' : 'unset'}
        direction='column'
      >
        <Shortener />
        <Box mb='5'>
          {state.urls?.length > 0 && (
            <>
              <IconButton
                variant='outline'
                aria-label='Filter database'
                size='md'
                mx='5'
                onClick={onOpen}
                icon={<Filter />}
              />
              <Select
                icon={<Click />}
                width={['55%', '33%', '25%', '15%']}
                display='inline-block'
                mr='5'
                mb={['5', '0', '0']}
                value={queries.count}
                name='count'
                onChange={(e) =>
                  setQueries({ count: e.target.value as Arrange })
                }
              >
                <option value=''>Filter by Clicks</option>
                <option value='asc'>Ascending</option>
                <option value='desc'>Descending</option>
              </Select>
              <Select
                icon={<Calendar />}
                width={['55%', '33%', '25%', '15%']}
                display='inline-block'
                ml={['5', '0', '0']}
                value={queries.createdAt}
                name='createdAt'
                onChange={(e) =>
                  setQueries({ createdAt: e.target.value as Arrange })
                }
              >
                <option value=''>Filter by date</option>
                <option value='asc'>Ascending</option>
                <option value='desc'>Descending</option>
              </Select>
            </>
          )}
          {!isFetching && (
            <IconButton
              variant='outline'
              aria-label='Reset database'
              size='md'
              mx='5'
              onClick={resetHandler}
              icon={<RepeatIcon />}
            />
          )}
        </Box>
        {Component()}
        {state.urls?.length > 0 && (
          <Button
            disabled={!hasNextPage || isFetchingNextPage}
            alignSelf='center'
            my='5'
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
          </Button>
        )}
      </Flex>
    </>
  )
}

export default LinkShortener
