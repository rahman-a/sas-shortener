import React from 'react'
import {
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Image,
  VStack,
  Heading,
  Divider,
  HStack,
  Icon,
  StackDivider,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../context/user'
import { Link as LinkIcon, Business, Contact } from '../assets/icons'
import { isAuthorized } from '../utils'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

const Drawer = ({ isOpen, onClose }: DrawerProps) => {
  const { roles } = useUserContext()
  const menu = [
    {
      id: 1,
      icon: LinkIcon,
      title: 'Link Shortener',
      link: '/shortener',
      isAuth: isAuthorized(roles, 'manage_urls'),
    },
    {
      id: 2,
      icon: Contact,
      title: 'Contact List',
      link: '/contact-list',
      isAuth: isAuthorized(roles, 'manage_contacts'),
    },
    {
      id: 3,
      icon: Business,
      title: 'Jobs Management',
      link: '/job-management',
      isAuth: isAuthorized(roles, 'manage_jobs'),
    },
  ]
  return (
    <ChakraDrawer size='xs' isOpen={isOpen} placement='left' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader pb='0'>
          <VStack>
            <Image src='/logo.webp' alt='sas logo' />
            <Heading as='p' color='blue.400' fontSize='xl' fontWeight='500'>
              Admin Panel
            </Heading>
          </VStack>
          <Divider pt='5' />
        </DrawerHeader>
        <DrawerBody p='0'>
          <VStack
            align='start'
            divider={
              <StackDivider margin='0 !important' borderColor='gray.200' />
            }
          >
            {menu.map(
              (item) =>
                item.isAuth && (
                  <Link to={item.link} style={{ width: '100%' }} key={item.id}>
                    <HStack
                      spacing='5'
                      width='100%'
                      height='100%'
                      p='5'
                      _hover={{
                        background: 'gray.100',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon as={item.icon} color='blue.400' />
                      <Heading as='p' fontSize='md' fontWeight='500'>
                        {item.title}
                      </Heading>
                    </HStack>
                  </Link>
                )
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </ChakraDrawer>
  )
}

export default Drawer
