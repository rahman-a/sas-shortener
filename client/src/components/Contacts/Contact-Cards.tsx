import React, { useState, useRef, useEffect } from 'react'
import {
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Heading,
  Text,
  Button,
  useDisclosure,
  VStack,
  StackDivider,
  Badge,
  useToast,
  ToastId,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import DeleteButton from '../Delete-Button'
import api from '../../api'
import { Contact } from '../../types'
import ContactDetails from './Contact-Details-Modal'
import { useContacts, ActionTypes } from '../../context/contacts'

interface ContactCardProps {
  contact: Contact
}
interface Inquiry {
  [key: string]: string
}

interface ContactDetailsProps {
  subject: string
  message: string
}

const inquiryTypes: Inquiry = {
  general: 'General Inquiry',
  proposal: 'Request for Proposal',
  employment: 'Employment',
}

const ContactCard = ({ contact }: ContactCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [contactDetails, setContactDetails] = useState<ContactDetailsProps>(
    {} as ContactDetailsProps
  )
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatch } = useContacts()
  const toastIdRef = useRef<ToastId>()
  const toast = useToast()
  const mutation = useMutation(api.deleteContact, {
    onSuccess: (data) => {
      timeoutRef.current = setTimeout(() => {
        dispatch({
          type: ActionTypes.DELETE_CONTACT,
          payload: data.contact._id,
        })
      }, 100)
    },
  })
  const viewContactDetails = (contact: ContactDetailsProps) => {
    onOpen()
    setContactDetails(contact)
  }
  useEffect(() => {
    if (mutation.isSuccess) {
      toastIdRef.current = toast({
        title: 'Contact has been deleted.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      mutation.reset()
    }
  }, [mutation.isSuccess])
  return (
    <>
      <ContactDetails
        isOpen={isOpen}
        onClose={onClose}
        contact={contactDetails}
      />
      <Card>
        <CardHeader pb='1'>
          <Heading as='h3' size='sm' color='blue.400'>
            {contact.name}
          </Heading>
          <Text color='gray.500'>{contact.email}</Text>
          <Text color='gray.500'>
            {contact.phone ? (
              contact.phone
            ) : (
              <Badge colorScheme='red' variant='solid'>
                N/A
              </Badge>
            )}
          </Text>
        </CardHeader>
        <CardBody>
          <VStack
            spacing='2.5'
            alignItems='flex-start'
            divider={<StackDivider borderColor='gray.200' />}
          >
            <HStack spacing='2'>
              <Text color='gray.400'>Organization:</Text>
              <Text>
                {contact.organization ? (
                  contact.organization
                ) : (
                  <Badge colorScheme='red' variant='solid'>
                    N/A
                  </Badge>
                )}
              </Text>
            </HStack>
            <HStack spacing='2'>
              <Text color='gray.400'>Role at Organization:</Text>
              <Text>
                {contact.role ? (
                  contact.role
                ) : (
                  <Badge colorScheme='red' variant='solid'>
                    N/A
                  </Badge>
                )}
              </Text>
            </HStack>
            <HStack spacing='2'>
              <Text color='gray.400'>Requested Location to Respond:</Text>
              <Text>
                {contact.location ? (
                  contact.location
                ) : (
                  <Badge colorScheme='red' variant='solid'>
                    N/A
                  </Badge>
                )}
              </Text>
            </HStack>
            <HStack spacing='2'>
              <Text color='gray.400'>Inquiry Type:</Text>
              <Text>{inquiryTypes[contact.inquiry]}</Text>
            </HStack>
          </VStack>
        </CardBody>
        <CardFooter justifyContent='flex-end'>
          <HStack spacing='5'>
            <Button
              color='blue.600'
              size='sm'
              leftIcon={<ViewIcon />}
              variant='solid'
              onClick={() =>
                viewContactDetails({
                  subject: contact.subject,
                  message: contact.message!,
                })
              }
            >
              View
            </Button>
            <DeleteButton
              isLoading={false}
              onDelete={() => mutation.mutate(contact._id)}
            />
          </HStack>
        </CardFooter>
      </Card>
    </>
  )
}
const ContactCards = () => {
  const { state } = useContacts()

  return (
    <SimpleGrid
      mx='5'
      spacing={4}
      templateColumns='repeat(auto-fill, minmax(25rem, 1fr))'
      display={['block', 'block', 'none']}
    >
      {state.contacts?.map((contact, index) => (
        <ContactCard key={contact._id} contact={contact} />
      ))}
    </SimpleGrid>
  )
}

export default ContactCards
