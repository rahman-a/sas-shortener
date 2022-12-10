import React, { useEffect, useState } from 'react'
import {
  Flex,
  Box,
  Container,
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
import { useQuery, useInfiniteQuery } from 'react-query'
import Shortener from './Shortener'
import ContentTable from './Content-Table'
import ContentCards from './Content-Cards'
import FilterData from './Filter-Data'
import { Filter, Reset, Click, Calendar } from '../assets/icons'
import { getUrls } from '../api'
import { useURLContext, ActionType } from '../context/url'

interface SortQuery {
  clicks?: string
  createdAt?: string
}

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [createdAt, setCreatedAt] = useState<string>('')
  const [clicks, setClicks] = useState<string>('')
  const { state, dispatch } = useURLContext()

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['urls', { createdAt, clicks }], getUrls, {
    getNextPageParam: (lastPage, pages) =>
      lastPage.urls.length ? pages.length + 1 : undefined,
  })

  const refineQueryData = (data: any) => {
    const refinedData = data.pages.map((page: any) => page.urls)
    return refinedData.flat()
  }

  const resetHandler = () => {
    setCreatedAt('')
    setClicks('')
    data &&
      dispatch({ type: ActionType.GET_URLS, payload: refineQueryData(data) })
  }

  const clicksSortHandler = (value: string) => {
    setCreatedAt('')
    setClicks(value)
  }
  const dateSortHandler = (value: string) => {
    setClicks('')
    setCreatedAt(value)
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
    if (state.urls?.length === 0) {
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
      <FilterData isOpen={isOpen} onClose={onClose} />
      <Flex alignItems='center' direction='column' py='10' height='100%'>
        <Shortener />
        <Container maxW='container.xl'>
          <Flex
            width='100%'
            flexGrow='1'
            justifyContent='start'
            alignItems={status === 'loading' ? 'center' : 'unset'}
            direction='column'
          >
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
                    value={clicks}
                    onChange={(e) => clicksSortHandler(e.target.value)}
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
                    value={createdAt}
                    onChange={(e) => dateSortHandler(e.target.value)}
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
                  icon={<Reset />}
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
        </Container>
      </Flex>
    </>
  )
}

export default Dashboard
