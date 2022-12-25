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
  useToast,
  ToastId,
  Button,
  Heading,
  Badge,
  useDisclosure,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import api from '../../api'
import DeleteButton from './../Delete-Button'
import ContactDetails from './Contact-Details-Modal'
import { useContacts, ActionTypes } from '../../context/contacts'

interface Inquiry {
  [key: string]: string
}
interface ContactDetails {
  subject: string
  message: string
}

const inquiryTypes: Inquiry = {
  general: 'General Inquiry',
  proposal: 'Request for Proposal',
  employment: 'Employment',
}

const ContentTable = () => {
  const [contact, setContact] = useState<ContactDetails>({} as ContactDetails)
  const [deletedItem, setDeletedItem] = useState<string>('')
  const toastIdRef = useRef<ToastId>()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { state, dispatch } = useContacts()
  const timeoutRef = useRef<NodeJS.Timeout>()

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
  const deleteUrlHandler = async (id: string) => {
    setDeletedItem(id)
    mutation.mutate(id)
  }
  const viewContactDetails = (contact: ContactDetails) => {
    onOpen()
    setContact(contact)
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
      <ContactDetails isOpen={isOpen} onClose={onClose} contact={contact} />
      {state.contacts.length > 0 && (
        <TableContainer mx='5' display={['none', 'none', 'block']}>
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th>Client Name</Th>
                <Th>E-mail Address</Th>
                <Th>Phone Number</Th>
                <Th>Client Organization</Th>
                <Th>Client Role at Organization</Th>
                <Th>Requested Location to Respond</Th>
                <Th>Inquiry Type</Th>
                <Th>Contact Details</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {state.contacts.map((contact, index) => (
                <Tr key={contact._id}>
                  <Td title={contact.name}>
                    <Heading color='blue.400' as='h3' size='xs'>
                      {contact.name}
                    </Heading>
                  </Td>
                  <Td>
                    <Link href={`mailto:${contact.email}`}>
                      {contact.email}
                    </Link>
                  </Td>
                  <Td>
                    {contact.phone ? (
                      <Link href={`tel:${contact.phone}`}>{contact.phone}</Link>
                    ) : (
                      <Badge colorScheme='red' variant='solid'>
                        N/A
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {contact.organization ? (
                      contact.organization
                    ) : (
                      <Badge colorScheme='red' variant='solid'>
                        N/A
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {contact.role ? (
                      contact.role
                    ) : (
                      <Badge colorScheme='red' variant='solid'>
                        N/A
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {contact.location ? (
                      contact.location
                    ) : (
                      <Badge colorScheme='red' variant='solid'>
                        N/A
                      </Badge>
                    )}
                  </Td>
                  <Td>{inquiryTypes[contact.inquiry]}</Td>
                  <Td>
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
                  </Td>
                  <Td>
                    <DeleteButton
                      isLoading={
                        mutation.isLoading && deletedItem === contact._id
                      }
                      onDelete={() => deleteUrlHandler(contact._id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}

export default ContentTable
