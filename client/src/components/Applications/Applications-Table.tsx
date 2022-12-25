import { useEffect, useRef, useState } from 'react'
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useToast,
  ToastId,
  Button,
  Badge,
  useDisclosure,
  Heading,
  Link,
  IconButton,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { DownloadIcon, EditIcon } from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import api from '../../api'
import DeleteButton from '../Delete-Button'
import { useJobs, ActionTypes } from '../../context/jobs'
import { Applications } from '../../types'
import UpdateStatus from './Update-Status'

type Status = Applications['status']

const statusBadge = {
  applied: (
    <Badge variant='solid' colorScheme='gray'>
      Applied
    </Badge>
  ),
  interviewing: (
    <Badge variant='solid' colorScheme='yellow'>
      Interviewing
    </Badge>
  ),
  offered: (
    <Badge variant='solid' colorScheme='green'>
      Offered
    </Badge>
  ),
  rejected: (
    <Badge variant='solid' colorScheme='red'>
      Rejected
    </Badge>
  ),
}

const ApplicantsTable = () => {
  const [deletedItem, setDeletedItem] = useState<string>('')
  const [applicationId, setApplicationId] = useState<string>('')
  const toastIdRef = useRef<ToastId>()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { state, dispatch } = useJobs()
  const timeoutRef = useRef<NodeJS.Timeout>()

  const mutation = useMutation(api.deleteApplication, {
    onSuccess: (data) => {
      timeoutRef.current = setTimeout(() => {
        dispatch({
          type: ActionTypes.DELETE_APPLICATION,
          payload: data.application._id!,
        })
      }, 100)
    },
  })
  const deleteApplicationHandler = async (id: string) => {
    setDeletedItem(id)
    mutation.mutate(id)
  }
  const updateApplicationStatus = (id: string) => {
    setApplicationId(id)
    onOpen()
  }
  const downloadResume = (url: string) => {
    if (!url)
      return toast({
        title: 'No resume provided',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })

    window.open(`http://localhost:5000/api/resumes/${url}`, '_blank')
  }
  useEffect(() => {
    if (mutation.isSuccess) {
      toastIdRef.current = toast({
        title: 'Application has been deleted.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      mutation.reset()
    }
  }, [mutation.isSuccess])
  return (
    <>
      <UpdateStatus isOpen={isOpen} onClose={onClose} id={applicationId} />
      {state.applications.length > 0 && (
        <TableContainer mx='5' display={['none', 'none', 'block']}>
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th>#ID</Th>
                <Th>Applicant Name</Th>
                <Th>E-mail Address</Th>
                <Th>Phone Number</Th>
                <Th>Country</Th>
                <Th>Address</Th>
                <Th>Applicant Status</Th>
                <Th>Targeted Job</Th>
                <Th>Applicant Resume</Th>
                <Th>Created At</Th>
                <Th>Last Updated</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {state.applications.map((application, index) => (
                <Tr key={application._id}>
                  <Td>{application.applicationId}</Td>
                  <Td>{`${application.firstName} ${application.lastName}`}</Td>
                  <Td>
                    <Link href={`mailto:${application.email}`}>
                      {application.email}
                    </Link>
                  </Td>
                  <Td>
                    {application.phone ? (
                      <Link href={`tel:${application.phone}`}>
                        {application.phone}
                      </Link>
                    ) : (
                      <Badge colorScheme='red' variant='solid'>
                        N/A
                      </Badge>
                    )}
                  </Td>
                  <Td>{application.country}</Td>
                  <Td>
                    {application.address ? (
                      application.address
                    ) : (
                      <Badge colorScheme='red' variant='solid'>
                        N/A
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    <HStack spacing='3'>
                      {statusBadge[application.status as Status]}
                      <IconButton
                        icon={<EditIcon />}
                        aria-label='edit application status'
                        onClick={() =>
                          updateApplicationStatus(application._id!)
                        }
                      />
                    </HStack>
                  </Td>
                  <Td title={application.job?.title}>
                    <Heading
                      size='xs'
                      width='2xs'
                      lineHeight='1.4'
                      style={{ whiteSpace: 'break-spaces' }}
                    >
                      {application.job!?.title.length > 50 ? (
                        <span>{application.job?.title.slice(0, 50)}...</span>
                      ) : (
                        application.job?.title
                      )}
                    </Heading>
                  </Td>
                  <Td>
                    <Button
                      leftIcon={<DownloadIcon />}
                      onClick={() => downloadResume(application.resume!)}
                    >
                      Download
                    </Button>
                  </Td>
                  <Td>
                    {new Date(
                      application.createdAt as unknown as Date
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Td>
                  <Td>
                    {new Date(
                      application.updatedAt as unknown as Date
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Td>
                  <Td>
                    <DeleteButton
                      isLoading={
                        mutation.isLoading && deletedItem === application._id
                      }
                      onDelete={() =>
                        deleteApplicationHandler(application._id!)
                      }
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

export default ApplicantsTable
