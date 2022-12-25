import { useState, useEffect } from 'react'
import {
  Flex,
  Box,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  Button,
  IconButton,
  Select,
  useDisclosure,
} from '@chakra-ui/react'
import { useInfiniteQuery } from 'react-query'
import { RepeatClockIcon } from '@chakra-ui/icons'
import JobsTable from './Jobs-Table'
import JobsCards from './Jobs-Cards'
import JobFilter from './Job-Filter'
import api from '../../api'
import type { JobQueries } from '../../types'
import { useJobs, ActionTypes } from '../../context/jobs'
import { Filter, Calendar } from '../../assets/icons'
const JobData = () => {
  const [queries, setQueries] = useState<JobQueries>({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { state, dispatch } = useJobs()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['jobs', { ...queries }], api.getJobs, {
    enabled: state.jobs?.length === 0 || Object.keys(queries).length > 0,
    staleTime: Infinity,
    getNextPageParam: (lastPage, pages) =>
      lastPage.jobs.length ? pages.length + 1 : undefined,
  })
  const resetHandler = () => {
    setQueries({})
  }
  const refineQueryData = (data: any) => {
    if (!data) return []
    const refinedData = data.pages.map((page: any) => page.jobs)
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
    if (state.jobs?.length === 0) {
      return (
        <Alert status='info' display='flex' justifyContent='center'>
          <AlertIcon />
          <AlertTitle>No Contacts Found</AlertTitle>
        </Alert>
      )
    }
    return (
      <>
        <JobsTable />
        <JobsCards />
      </>
    )
  }
  useEffect(() => {
    data &&
      dispatch({
        type: ActionTypes.GET_JOBS,
        payload: refineQueryData(data),
      })
  }, [data])
  return (
    <>
      <JobFilter
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
          {state.jobs?.length > 0 && (
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
        {state.jobs?.length > 0 && (
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

export default JobData
