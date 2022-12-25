import React, { useContext, useEffect } from 'react'
import {
  Flex,
  Box,
  Image,
  Heading,
  HStack,
  IconButton,
  Spinner,
  useDisclosure,
  Container,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import { useLocation } from 'react-router-dom'
import { Logout } from '../assets/icons'
import logoWhite from '../assets/images/logo-white.webp'
import api from '../api'
import { useUserContext } from '../context/user'
import Drawer from './Drawer'

interface HeaderTitleProps {
  [key: string]: string
}

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setIsAuthenticated } = useUserContext()
  const location = useLocation()
  const pathname = location.pathname

  const headerText: HeaderTitleProps = {
    '/shortener': 'SAS URL Shortener',
    '/contact-list': 'SAS Contact List',
    '/job-management': 'SAS Job Management',
  }
  const mutation = useMutation(api.logoutUser, {
    onSuccess: () => {
      setIsAuthenticated(false)
      localStorage.removeItem('sas-short')
    },
  })
  useEffect(() => {
    onClose()
  }, [pathname])
  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} />
      <Box as='nav' role='navigation' bg='#1e95e0'>
        <Container maxW='auto'>
          <Box minHeight='20' py='3' px='4' width='100%'>
            <Flex
              width='100%'
              height='100%'
              justifyContent='space-between'
              alignItems='center'
            >
              <Box objectFit='cover'>
                <HStack>
                  <IconButton
                    aria-label='menu toggle'
                    variant='unstyled'
                    size='xl'
                    color='#fff'
                    icon={<HamburgerIcon />}
                    onClick={onOpen}
                    title='menu toggle'
                  />
                  <Image src={logoWhite} alt='logo' />
                </HStack>
              </Box>
              <HStack spacing={10}>
                <Heading size='sm' textAlign='center' color='#fff'>
                  {headerText[pathname as keyof HeaderTitleProps]}
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
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Header
