import React, { useEffect, useState } from 'react'
import {
  Flex,
  Box,
  IconButton,
  Select,
  Button,
  Spinner,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  useDisclosure,
} from '@chakra-ui/react'
import ApplicationsTable from './Applications-Table'
import ApplicationsCards from './Applications-Cards'
import { useInfiniteQuery } from 'react-query'
import { RepeatClockIcon } from '@chakra-ui/icons'
import ApplicationFilter from './Application-Filter'
import api from '../../api'
import type { ApplicationsQuery } from '../../types'
import { useJobs, ActionTypes } from '../../context/jobs'
import { Filter, Calendar } from '../../assets/icons'

const ApplicantsData = () => {
  const [queries, setQueries] = useState<ApplicationsQuery>(
    {} as ApplicationsQuery
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { state, dispatch } = useJobs()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['applications', { ...queries }], api.getApplications, {
    enabled:
      state.applications?.length === 0 || Object.keys(queries).length > 0,
    staleTime: Infinity,
    getNextPageParam: (lastPage, pages) =>
      lastPage.applications.length ? pages.length + 1 : undefined,
  })
  const resetHandler = () => {
    setQueries({} as ApplicationsQuery)
  }
  const refineQueryData = (data: any) => {
    if (!data) return []
    const refinedData = data.pages.map((page: any) => page.applications)
    return refinedData.flat()
  }

  const Components = () => {
    if (status === 'loading') {
      return <Spinner size='xl' />
    }
    if (status === 'error') {
      return (
        <Alert status='error' display='flex' justifyContent='center'>
          <AlertIcon />
          <AlertDescription>
            'Something went wrong, please try again'
          </AlertDescription>
        </Alert>
      )
    }
    if (state.applications?.length === 0) {
      return (
        <Alert status='info' display='flex' justifyContent='center'>
          <AlertIcon />
          <AlertTitle>No Applications Found</AlertTitle>
        </Alert>
      )
    }
    return (
      <>
        <ApplicationsTable />
        <ApplicationsCards />
      </>
    )
  }
  useEffect(() => {
    data &&
      dispatch({
        type: ActionTypes.GET_APPLICATIONS,
        payload: refineQueryData(data),
      })
  }, [data])
  return (
    <>
      <ApplicationFilter
        isOpen={isOpen}
        onClose={onClose}
        queryData={queries}
        setQueryData={setQueries}
      />
      <Flex
        flexGrow='1'
        justifyContent='start'
        direction='column'
        alignItems={status === 'loading' ? 'center' : 'unset'}
      >
        <Box mb='5'>
          {state.applications?.length > 0 && (
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
                icon={<Calendar />}
                width={['55%', '33%', '25%', '15%']}
                display='inline-block'
                ml={['5', '0', '0']}
                value={queries['createdAt'] || ''}
                onChange={(e) =>
                  setQueries({
                    ...queries,
                    createdAt: e.target.value as 'asc' | 'desc',
                  })
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
              icon={<RepeatClockIcon />}
            />
          )}
        </Box>
        {Components()}
        {state.applications?.length > 0 && (
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

export default ApplicantsData
