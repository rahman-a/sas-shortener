import React, { useEffect, useRef, useState } from 'react'
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  useClipboard,
  useToast,
  ToastId,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import {
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  DeleteIcon,
} from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import { useURLContext, ActionType } from '../context/url'
import { deleteUrl } from '../api'
import DeleteButton from './Delete-Button'

const href = 'http://localhost:5000/' // for local development

const Content = () => {
  const { onCopy, value, setValue, hasCopied } = useClipboard('')
  const [deletedItem, setDeletedItem] = useState<string>('')
  const toastIdRef = useRef<ToastId>()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const toast = useToast()
  const { state, dispatch } = useURLContext()
  const mutation = useMutation(deleteUrl, {
    onSuccess: (data) => {
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: ActionType.DELETE_URL, payload: data.url.short })
      }, 100)
    },
  })
  const deleteUrlHandler = async (short: string) => {
    setDeletedItem(short)
    mutation.mutate(short)
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      console.log('mutation.isSuccess: ', mutation.isSuccess)
      toastIdRef.current = toast({
        title: 'URL has been deleted.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      mutation.reset()
    }
  }, [mutation.isSuccess])

  useEffect(() => {
    if (value) {
      onCopy()
    }
  }, [value])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  return (
    <TableContainer mx='5' display={['none', 'none', 'block']}>
      <Table variant='striped'>
        <Thead>
          <Tr>
            <Th>Origin URL</Th>
            <Th>Short URL</Th>
            <Th isNumeric>Clicks</Th>
          </Tr>
        </Thead>
        <Tbody>
          {state.urls?.map((url, index) => (
            <Tr key={url.short}>
              <Td className='ellipse-url-cell' title={url.destination}>
                <Link isExternal href={url.destination}>
                  {url.destination}
                </Link>
                <ExternalLinkIcon mx='2px' />
              </Td>
              <Td>
                <Link isExternal href={`${href}${url.short}`} width='2xl'>
                  {`${href}${url.short}`}
                </Link>
                {hasCopied && value === `${href}${url.short}` ? (
                  <CheckIcon ml='0.5rem' color='green.500' />
                ) : (
                  <CopyIcon
                    ml='0.5rem'
                    cursor='pointer'
                    onClick={() => {
                      setValue(`${href}${url.short}`)
                    }}
                  />
                )}
              </Td>
              <Td isNumeric>{url.clicks}</Td>
              <Td padding='0'>
                <DeleteButton
                  isLoading={mutation.isLoading && deletedItem === url.short}
                  onDelete={() => deleteUrlHandler(url.short)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default Content
