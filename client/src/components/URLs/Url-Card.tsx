import { FC, useEffect, useRef } from 'react'
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
import { useURLContext, ActionType } from '../../context/url'
import api from '../../api'
import DeleteButton from './../Delete-Button'

interface ContentCardProps {
  content: {
    _id: string
    original_url: string
    short_url: string
    shortId: string
    clicks: number
    createdAt: string
    updatedAt: string
  }
}

const ContentCard: FC<ContentCardProps> = ({ content }) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard('')
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatch } = useURLContext()
  const toastIdRef = useRef<ToastId>()
  const toast = useToast()
  const mutation = useMutation(api.deleteUrl, {
    onSuccess: (data) => {
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: ActionType.DELETE_URL, payload: data.url._id })
      }, 100)
    },
  })
  const deleteUrlHandler = async (id: string) => {
    mutation.mutate(id)
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
                href={content.original_url}
                isExternal
                title={content.original_url}
                maxWidth='20rem !important'
              >
                {content.original_url}
              </Link>
              <ExternalLinkIcon mx='2px' />
            </Text>
          </Box>
          <Box>
            <Text fontSize='md' fontWeight='bold'>
              <Link href={content.short_url} isExternal>
                {content.short_url}
              </Link>
              {hasCopied ? (
                <CheckIcon ml='0.5rem' color='green.500' />
              ) : (
                <CopyIcon
                  ml='0.5rem'
                  cursor='pointer'
                  onClick={() => {
                    setValue(content.short_url)
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
                onDelete={() => deleteUrlHandler(content._id)}
              />
            </HStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}
export default ContentCard
