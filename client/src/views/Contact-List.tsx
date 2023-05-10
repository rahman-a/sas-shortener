import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Button,
  IconButton,
  Select,
  useDisclosure,
} from '@chakra-ui/react'
import { useInfiniteQuery } from 'react-query'
import { Helmet } from 'react-helmet-async'
import ContactTable from '../components/Contacts/Contact-Table'
import ContactCards from '../components/Contacts/Contact-Cards'
import { RepeatClockIcon } from '@chakra-ui/icons'
import { useContacts, ActionTypes } from '../context/contacts'
import { useUserContext } from '../context/user'
import { isAuthorized } from '../utils'
import api from '../api'
import type { ContactsQueries } from '../types'
import { Calendar, Filter } from '../assets/icons'
import FilterContact from '../components/Contacts/Filter-Contacts'
import NotAuth from '../components/Not-Auth'

const ContactList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [queries, setQueries] = useState<ContactsQueries>({})
  const { state, dispatch } = useContacts()
  const { roles } = useUserContext()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['contacts', { ...queries }], api.getContacts, {
    enabled: state.contacts?.length === 0 || Object.keys(queries).length > 0,
    staleTime: Infinity,
    getNextPageParam: (lastPage, pages) =>
      lastPage.contacts.length ? pages.length + 1 : undefined,
  })

  const resetHandler = () => {
    setQueries({})
  }

  const refineQueryData = (data: any) => {
    if (!data) return []
    const refinedData = data.pages.map((page: any) => page.contacts)
    return refinedData.flat()
  }

  if (!isAuthorized(roles, 'manage_contacts')) {
    return <NotAuth title='Contacts List' header='List of all contacts' />
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
            Something went wrong, please try again
          </AlertDescription>
        </Alert>
      )
    }
    if (refineQueryData(data)?.length === 0) {
      return (
        <Alert status='info' display='flex' justifyContent='center'>
          <AlertIcon />
          <AlertTitle>No Contacts Found</AlertTitle>
        </Alert>
      )
    }
    return (
      <>
        <ContactTable />
        <ContactCards />
      </>
    )
  }

  useEffect(() => {
    data &&
      dispatch({
        type: ActionTypes.GET_CONTACTS,
        payload: refineQueryData(data),
      })
  }, [data])

  return (
    <>
      <Helmet>
        <title>Contacts List</title>
      </Helmet>
      <FilterContact
        isOpen={isOpen}
        onClose={onClose}
        queries={queries}
        setQueries={setQueries}
      />
      <Flex
        flexGrow='1'
        justifyContent='start'
        direction='column'
        alignItems={status === 'loading' ? 'center' : 'unset'}
      >
        <Box mb='5'>
          <Heading as='h1' size='lg'>
            Contact List
          </Heading>
          <Text fontSize='sm' color='gray.500'>
            List of all contacts
          </Text>
        </Box>
        <Box mb='5'>
          {state.contacts?.length > 0 && !isFetching && (
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
                  setQueries({ ...queries, createdAt: e.target.value })
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
        {state.contacts?.length > 0 && (
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

export default ContactList
