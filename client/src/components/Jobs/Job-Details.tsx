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
} from '@chakra-ui/react'
import parser from 'html-react-parser'

interface JobDetailsProps {
  isOpen: boolean
  onClose: () => void
  description: string
}

const JobDetails = ({ isOpen, onClose, description }: JobDetailsProps) => {
  return (
    <Modal
      size={['sm', 'sm', 'md', 'xl']}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as='h4' size='md'>
            Job Details
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Box>
            <Text fontSize='md' color='gray.500'>
              {parser(description)}
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

export default JobDetails
