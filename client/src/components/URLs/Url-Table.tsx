import React, { useEffect, useRef, useState } from 'react'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  useClipboard,
  useToast,
  ToastId,
} from '@chakra-ui/react'
import { ExternalLinkIcon, CopyIcon, CheckIcon } from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import { useURLContext, ActionType } from '../../context/url'
import api from '../../api'
import DeleteButton from './../Delete-Button'

const Content = () => {
  const { onCopy, value, setValue, hasCopied } = useClipboard('')
  const [deletedItem, setDeletedItem] = useState<string>('')
  const toastIdRef = useRef<ToastId>()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const toast = useToast()
  const { state, dispatch } = useURLContext()
  const mutation = useMutation(api.deleteUrl, {
    onSuccess: (data) => {
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: ActionType.DELETE_URL, payload: data.url._id })
      }, 100)
    },
  })
  const deleteUrlHandler = async (id: string) => {
    setDeletedItem(id)
    mutation.mutate(id)
  }

  const increaseClicksHandler = async (id: string) => {
    dispatch({ type: ActionType.INCREASE_CLICKS, payload: id })
  }

  useEffect(() => {
    if (mutation.isSuccess) {
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
            <Tr key={url._id}>
              <Td className='ellipse-url-cell' title={url.original_url}>
                <Link isExternal href={url.original_url}>
                  {url.original_url}
                </Link>
                <ExternalLinkIcon mx='2px' />
              </Td>
              <Td>
                <Link
                  isExternal
                  href={url.short_url}
                  width='2xl'
                  onClick={() => increaseClicksHandler(url._id)}
                >
                  {url.short_url}
                </Link>
                {hasCopied && value === url.shortId ? (
                  <CheckIcon ml='0.5rem' color='green.500' />
                ) : (
                  <CopyIcon
                    ml='0.5rem'
                    cursor='pointer'
                    onClick={() => {
                      setValue(url.shortId)
                    }}
                  />
                )}
              </Td>
              <Td isNumeric>{url.clicks}</Td>
              <Td padding='0'>
                <DeleteButton
                  isLoading={mutation.isLoading && deletedItem === url._id}
                  onDelete={() => deleteUrlHandler(url._id)}
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
