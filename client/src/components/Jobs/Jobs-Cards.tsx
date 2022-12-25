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
import { Job } from '../../types'
import JobDetails from './Job-Details'
import { useJobs, ActionTypes } from '../../context/jobs'

interface JobCardProps {
  job: Job
}

const JobsCard = ({ job }: JobCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [jobDescription, setJobDescription] = useState<string>('')
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatch } = useJobs()
  const toastIdRef = useRef<ToastId>()
  const toast = useToast()
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
  const viewJobDescription = (description: string) => {
    onOpen()
    setJobDescription(description)
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
      <JobDetails
        isOpen={isOpen}
        onClose={onClose}
        description={jobDescription!}
      />
      <Card width='92vw' ml='-1rem'>
        <CardHeader pb='1'>
          <Text color='gray.500'>#{job.jobId}</Text>
          <Heading my='2' as='h3' size='sm'>
            {job.title}
          </Heading>
          <Text color='gray.500'>{job.jobType.toLocaleUpperCase()}</Text>
        </CardHeader>
        <CardBody>
          <VStack
            spacing='2.5'
            alignItems='flex-start'
            divider={<StackDivider borderColor='gray.200' />}
          >
            <HStack spacing='2'>
              <Text color='gray.400'>Targeted Company:</Text>
              <Text>{job.company}</Text>
            </HStack>
            <HStack spacing='2'>
              <Text color='gray.400'>Country:</Text>
              <Text>{job.country}</Text>
            </HStack>
            <HStack spacing='2'>
              <Text color='gray.400'>Offered Salary:</Text>
              <Text>
                {job.salary ? (
                  job.salary
                ) : (
                  <Badge colorScheme='red' variant='solid'>
                    N/A
                  </Badge>
                )}
              </Text>
            </HStack>
            <HStack spacing='2'>
              <Text color='gray.400'>Required Skills:</Text>
              <Text>
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
              </Text>
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
              onClick={() => viewJobDescription(job.description)}
            >
              View
            </Button>
            <DeleteButton
              isLoading={false}
              onDelete={() => mutation.mutate(job._id!)}
            />
          </HStack>
        </CardFooter>
      </Card>
    </>
  )
}
const JobsCards = () => {
  const { state } = useJobs()

  return (
    <SimpleGrid
      mx='5'
      spacing={4}
      templateColumns='repeat(auto-fill, minmax(25rem, 1fr))'
      display={['block', 'block', 'none']}
    >
      {state.jobs?.map((job, index) => (
        <JobsCard key={job._id} job={job} />
      ))}
    </SimpleGrid>
  )
}

export default JobsCards
