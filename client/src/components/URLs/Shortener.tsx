import React, { useEffect, useState } from 'react'
import {
  Flex,
  Box,
  FormControl,
  Input,
  Button,
  Stack,
  Heading,
  Text,
  Spinner,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import api from '../../api'
import { useURLContext, ActionType } from '../../context/url'

type Error = {
  message: string
  stack?: string
}

const Shortener = () => {
  const [destinationUrl, setDestinationUrl] = useState<string>('')
  const [error, setError] = useState<string>('')

  const { dispatch } = useURLContext()

  const mutation = useMutation(api.shortenUrl, {
    onSuccess: (data) => {
      dispatch({ type: ActionType.SHORTEN_URL, payload: data.url })
      setDestinationUrl('')
    },
    onError: (error: Error) => {
      setError(error.message)
      console.log(error)
    },
  })

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate(destinationUrl)
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      setDestinationUrl('')
      mutation.reset()
    }
  }, [mutation])
  return (
    <Flex
      justifyContent='center'
      alignItems='center'
      pb='10'
      direction='column'
    >
      {mutation.isSuccess && (
        <Text size='sm' mb='5' color='green'>
          Short url created successfully!
        </Text>
      )}
      {mutation.isError && (
        <Text size='sm' mb='5' color='red'>
          {error}
        </Text>
      )}
      <Box>
        <form onSubmit={submitHandler}>
          <Stack spacing='5' align='center'>
            <FormControl width={['xs', 'sm', 'md', 'xl']}>
              <InputGroup size='md'>
                <InputLeftAddon children='http://' />
                <Input
                  type='url'
                  placeholder='add origin url'
                  variant='filled'
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <Button
              colorScheme='teal'
              type='submit'
              width='6.5rem'
              isLoading={mutation.isLoading}
            >
              Shorten
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  )
}

export default Shortener
