import { FC, FormEvent, useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalCloseButton,
  Button,
  VStack,
  StackDivider,
  Select,
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import api from '../../api'
import { Applications } from '../../types'
import { useJobs, ActionTypes } from '../../context/jobs'

type Status = Applications['status']

interface FilterDataProps {
  isOpen: boolean
  onClose: () => void
  id: string
}

const UpdateStatus: FC<FilterDataProps> = ({ isOpen, onClose, id }) => {
  const [status, setStatus] = useState<Status>('' as Status)
  const { dispatch } = useJobs()
  const mutation = useMutation(api.updateApplicationStatus, {
    onSuccess: (data) => {
      dispatch({
        type: ActionTypes.UPDATE_STATUS,
        payload: { _id: id, status: data.application.status },
      })
      onClose()
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
      <ModalOverlay minHeight='100vh' width='100%' bottom='0' height='unset' />
      <ModalContent>
        <ModalHeader>Update Application Status</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} divider={<StackDivider />}>
            <Select
              disabled={mutation.isLoading}
              display='inline-block'
              mr='5'
              mb={['5', '0', '0']}
              name='status'
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value=''>Update the applicant status</option>
              <option value='applied'>Applied</option>
              <option value='interviewing'>Interviewing</option>
              <option value='offered'>Offered</option>
              <option value='rejected'>Rejected</option>
            </Select>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={mutation.isLoading}
            disabled={mutation.isLoading}
            colorScheme='blue'
            mr={3}
            onClick={() => mutation.mutate({ id, status })}
          >
            Update
          </Button>
          <Button
            disabled={mutation.isLoading}
            colorScheme='ghost'
            mr={3}
            color='black'
            onClick={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UpdateStatus
