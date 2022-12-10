import React, { FC, useEffect, useRef } from 'react'
import {
  Box,
  Text,
  Link,
  VStack,
  StackDivider,
  Card,
  CardBody,
  HStack,
  useClipboard,
  useToast,
  ToastId,
} from '@chakra-ui/react'
import {
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  ViewIcon,
} from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import { useURLContext, ActionType } from '../context/url'
import { deleteUrl } from '../api'
import DeleteButton from './Delete-Button'

interface ContentCardProps {
  content: {
    destination: string
    short: string
    clicks: number
    createdAt: string
    updatedAt: string
  }
}

const href = 'http://localhost:5000/' // for local development

const ContentCard: FC<ContentCardProps> = ({ content }) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard('')
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatch } = useURLContext()
  const toastIdRef = useRef<ToastId>()
  const toast = useToast()
  const mutation = useMutation(deleteUrl, {
    onSuccess: (data) => {
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: ActionType.DELETE_URL, payload: data.url.short })
      }, 100)
    },
  })
  const deleteUrlHandler = async (short: string) => {
    mutation.mutate(short)
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
    <Card>
      <CardBody>
        <VStack spacing={4} divider={<StackDivider />}>
          <Box>
            <Text fontSize='lg' className='ellipse-url-cell'>
              <Link
                href={content.destination}
                isExternal
                title={content.destination}
                maxWidth='20rem !important'
              >
                {content.destination}
              </Link>
              <ExternalLinkIcon mx='2px' />
            </Text>
          </Box>
          <Box>
            <Text fontSize='md' fontWeight='bold'>
              <Link href={`${href}${content.short}`} isExternal>
                {`${href}${content.short}`}
              </Link>
              {hasCopied ? (
                <CheckIcon ml='0.5rem' color='green.500' />
              ) : (
                <CopyIcon
                  ml='0.5rem'
                  cursor='pointer'
                  onClick={() => {
                    setValue(`${href}${content.short}`)
                  }}
                />
              )}
            </Text>
          </Box>
          <Box>
            <HStack spacing='100'>
              <Text fontSize='sm' fontWeight='bold'>
                {content.clicks}
                <ViewIcon mx='2px' />
              </Text>
              <DeleteButton
                isLoading={mutation.isLoading}
                onDelete={() => deleteUrlHandler(content.short)}
              />
            </HStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}
export default ContentCard
