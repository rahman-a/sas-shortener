import React, { useState, useEffect, useContext } from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Flex,
  Button,
  Heading,
  Text,
  Image,
  Spinner,
} from '@chakra-ui/react'
import { useQueryClient, useMutation } from 'react-query'
import { login } from '../api'
import isEmail from 'validator/lib/isEmail'
import logoWhite from '../assets/images/logo-white.webp'
import { userContext } from '../context/user'

const Login = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
  const { setIsAuthenticated } = useContext(userContext)

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      setIsError(false)
      setIsSubmitting(false)
      localStorage.setItem('sas-short', JSON.stringify(data.user))
      setIsAuthenticated(true)
    },
    onError: () => {
      setIsError(true)
      setIsSubmitting(false)
    },
  })
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isEmailValid || password.length < 4) return
    setIsSubmitting(true)
    setIsError(false)
    mutation.mutate({ email, password })
  }

  useEffect(() => {
    email && setIsEmailValid(isEmail(email))
  }, [email])
  return (
    <>
      <Flex justifyContent='center' py='5'>
        <Image src={logoWhite} alt='logo' />
      </Flex>
      <Heading size='sm' textAlign='center' mb='5'>
        SAS URL Shortener Dashboard
      </Heading>
      <Box
        width={['xs', 'sm', 'md', 'lg']}
        p='5'
        mx='auto'
        bg='#fff'
        borderRadius={5}
        overflow='hidden'
        boxShadow='0px 0px 5px 2px rgb(0 0 0 / 30%)'
      >
        {isError && (
          <Text fontSize={['lg', 'xl', '2xl']} color='red' py='2'>
            Invalid credential data, please try again.
          </Text>
        )}
        <form onSubmit={submitHandler}>
          <VStack spacing={5}>
            <FormControl isInvalid={!isEmailValid || isError} isRequired>
              <FormLabel htmlFor='email-input'>Email address</FormLabel>
              <Input
                id='email-input'
                value={email}
                type='text'
                name='email'
                onChange={({ target: { value } }) => setEmail(value)}
              />
              {!isEmailValid && (
                <FormErrorMessage>Invalid email</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={isError}>
              <FormLabel htmlFor='password-input'>Password</FormLabel>
              <Input
                id='password-input'
                value={password}
                type='password'
                name='password'
                onChange={({ target: { value } }) => setPassword(value)}
              />
            </FormControl>
            <Button
              disabled={isSubmitting || !isEmailValid || password.length < 4}
              type='submit'
              colorScheme='blue'
              size='lg'
              width='full'
            >
              {isSubmitting ? <Spinner size='sm' /> : <Text>Submit</Text>}
            </Button>
          </VStack>
        </form>
      </Box>
    </>
  )
}

export default Login
