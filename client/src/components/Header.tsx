import React, { useContext } from 'react'
import {
  Flex,
  Box,
  Image,
  Heading,
  HStack,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import { Logout } from '../assets/icons'
import logoWhite from '../assets/images/logo-white.webp'
import { useMutation } from 'react-query'
import { logout } from '../api'
import { userContext } from '../context/user'

const Header = () => {
  const { setIsAuthenticated } = useContext(userContext)
  const mutation = useMutation(logout, {
    onSuccess: () => {
      setIsAuthenticated(false)
      localStorage.removeItem('sas-short')
    },
  })
  return (
    <Flex
      width='100%'
      height='100%'
      justifyContent='space-around'
      alignItems='center'
    >
      <Box boxSize='3.5rem' height='unset' objectFit='cover'>
        <Image src={logoWhite} alt='logo-white' />
      </Box>
      <HStack spacing={10}>
        <Heading size='sm' textAlign='center' color='#fff'>
          SAS URL Shortener
        </Heading>
        {mutation.isLoading ? (
          <Spinner size='sm' />
        ) : (
          <IconButton
            aria-label='logout'
            variant='unstyled'
            color='#fff'
            icon={<Logout width='1.6rem' height='2.5rem' />}
            onClick={() => mutation.mutate()}
            title='Logout'
          />
        )}
      </HStack>
    </Flex>
  )
}

export default Header
