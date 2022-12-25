import React, { useState, useEffect, useContext } from 'react'
import {
  Grid,
  GridItem,
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
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api from '../api'
import isEmail from 'validator/lib/isEmail'
import logoWhite from '../assets/images/logo-white.webp'
import { useUserContext } from '../context/user'
import { isAuthorized } from '../utils'

const Login = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
  const { isAuthenticated, setIsAuthenticated, roles } = useUserContext()
  const navigate = useNavigate()
  const mutation = useMutation(api.loginUser, {
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
    if (isAuthenticated) {
      if (isAuthorized(roles, 'manage_urls')) {
        navigate('/shortener')
        return
      }
      if (isAuthorized(roles, 'manage_contacts')) {
        navigate('/contact-list')
        return
      }
      if (isAuthorized(roles, 'manage_jobs')) {
        navigate('/job-management')
        return
      }
    }
  }, [isAuthenticated])
  useEffect(() => {
    email && setIsEmailValid(isEmail(email))
  }, [email])
  return (
    <Grid placeItems='center' minHeight='100vh' bg='#1e95e0'>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <GridItem>
        <Flex justifyContent='center' py='5'>
          <Image src={logoWhite} alt='logo' />
        </Flex>
        <Heading size='sm' textAlign='center' mb='5'>
          SAS URL Shortener Dashboard
        </Heading>
        <Box
          width={['sm', 'md', 'md', 'lg']}
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
                disabled={
                  isSubmitting || !isEmailValid || !email || password.length < 4
                }
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
      </GridItem>
    </Grid>
  )
}

export default Login
