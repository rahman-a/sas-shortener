import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Box,
  Heading,
  Text,
  ModalHeader,
  Button,
  Badge,
} from '@chakra-ui/react'

interface ContactDetailsProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    subject: string
    message: string
  }
}

const ContactDetails = ({ isOpen, onClose, contact }: ContactDetailsProps) => {
  return (
    <Modal
      size={['sm', 'sm', 'md']}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as='h4' size='md'>
            {contact.subject}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Box>
            <Text fontSize='md' color='gray.500'>
              {contact.message ? (
                contact.message
              ) : (
                <Badge variant='solid'>No Details provided</Badge>
              )}
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' onClick={onClose} size='sm'>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ContactDetails
