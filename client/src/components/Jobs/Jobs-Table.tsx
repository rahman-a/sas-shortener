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
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import api from '../../api'
import DeleteButton from './../Delete-Button'
import JobDetails from './Job-Details'
import { useJobs, ActionTypes } from '../../context/jobs'

const JobTable = () => {
  const [description, setDescription] = useState<string>('')
  const [deletedItem, setDeletedItem] = useState<string>('')
  const toastIdRef = useRef<ToastId>()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { state, dispatch } = useJobs()
  const timeoutRef = useRef<NodeJS.Timeout>()

  const mutation = useMutation(api.deleteJob, {
    onSuccess: (data) => {
      timeoutRef.current = setTimeout(() => {
        dispatch({
          type: ActionTypes.DELETE_JOB,
          payload: data.job._id!,
        })
      }, 100)
    },
  })
  const deleteJobHandler = async (id: string) => {
    setDeletedItem(id)
    mutation.mutate(id)
  }
  const viewJobDetails = (description: string) => {
    onOpen()
    setDescription(description)
  }
  useEffect(() => {
    if (mutation.isSuccess) {
      toastIdRef.current = toast({
        title: 'Job has been deleted.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      mutation.reset()
    }
  }, [mutation.isSuccess])
  return (
    <>
      <JobDetails isOpen={isOpen} onClose={onClose} description={description} />
      <TableContainer mx='5' display={['none', 'none', 'block']}>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>#ID</Th>
              <Th>Job Title</Th>
              <Th>Targeted Company</Th>
              <Th>Job Type</Th>
              <Th>Required Skills</Th>
              <Th>Country</Th>
              <Th>Offered Salary</Th>
              <Th>Created At</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {state?.jobs?.map((job, index) => (
              <Tr key={job._id}>
                <Td title={job.jobId}>{job.jobId}</Td>
                <Td title={job.title}>
                  <Heading
                    size='xs'
                    width='2xs'
                    lineHeight='1.4'
                    style={{ whiteSpace: 'break-spaces' }}
                  >
                    {job.title.length > 50 ? (
                      <span>{job.title.slice(0, 50)}...</span>
                    ) : (
                      job.title
                    )}
                  </Heading>
                </Td>
                <Td textAlign='center'>{job.company}</Td>
                <Td>{job.jobType.toLocaleUpperCase()}</Td>
                <Td pb='8' maxWidth='2xs' display='flex' flexWrap='wrap'>
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      colorScheme='blue'
                      variant='solid'
                      mr='1'
                      mb='1'
                    >
                      {skill}
                    </Badge>
                  ))}
                </Td>
                <Td textAlign='center'>{job.country}</Td>
                <Td>
                  {job.salary ? (
                    job.salary.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })
                  ) : (
                    <Badge colorScheme='red' variant='solid'>
                      N/A
                    </Badge>
                  )}
                </Td>
                <Td>
                  {new Date(
                    job.createdAt as unknown as Date
                  ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Td>
                <Td>
                  <Button
                    color='blue.600'
                    size='sm'
                    leftIcon={<ViewIcon />}
                    variant='solid'
                    onClick={() =>
                      viewJobDetails(job.description ? job.description : '')
                    }
                  >
                    View
                  </Button>
                </Td>
                <Td>
                  <DeleteButton
                    isLoading={mutation.isLoading && deletedItem === job._id}
                    onDelete={() => deleteJobHandler(job._id!)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

export default JobTable
