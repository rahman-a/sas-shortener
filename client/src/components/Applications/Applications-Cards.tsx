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
  Link,
  IconButton,
} from '@chakra-ui/react'
import { DownloadIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import DeleteButton from '../Delete-Button'
import api from '../../api'
import { Applications } from '../../types'
import UpdateStatus from './Update-Status'
import { useJobs, ActionTypes } from '../../context/jobs'

interface ApplicationCardProps {
  application: Applications
}

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

const ApplicationsCard = ({ application }: ApplicationCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { state, dispatch } = useJobs()
  const toastIdRef = useRef<ToastId>()
  const toast = useToast()
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
      <UpdateStatus isOpen={isOpen} onClose={onClose} id={application._id!} />
      <Card width='92vw' ml='-1rem'>
        <CardHeader pb='1'>
          <Text color='gray.500'>#{application.applicationId}</Text>
          <Heading my='2' as='h3' size='sm'>
            {application.firstName} {application.lastName}
          </Heading>
          <HStack spacing='2'>
            <Text color='gray.500'>
              <Link href={`mailto:${application.email}`}>
                {application.email}
              </Link>
            </Text>
            <HStack>
              {statusBadge[application.status]}
              <IconButton
                icon={<EditIcon />}
                size='xs'
                aria-label='edit application status'
                onClick={() => onOpen()}
              />
            </HStack>
          </HStack>
          <Text color='gray.500'>
            {application.phone ? (
              <Link href={`tel:${application.phone}`}>{application.phone}</Link>
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
              <Text color='gray.400'>Targeted Job:</Text>
              <Text>
                {application.job!?.title.length > 50 ? (
                  <span>{application.job?.title.slice(0, 50)}...</span>
                ) : (
                  application.job?.title
                )}
              </Text>
            </HStack>
            <HStack spacing='2'>
              <Text color='gray.400'>Country:</Text>
              <Text>{application.country}</Text>
            </HStack>
            <HStack spacing='2'>
              <Text color='gray.400'>Applicant Address</Text>
              <Text>
                {application.address ? (
                  application.address
                ) : (
                  <Badge colorScheme='red' variant='solid'>
                    N/A
                  </Badge>
                )}
              </Text>
            </HStack>
          </VStack>
        </CardBody>
        <CardFooter justifyContent='flex-end'>
          <HStack spacing='5'>
            <Button
              leftIcon={<DownloadIcon />}
              onClick={() => downloadResume(application.resume!)}
            >
              Download
            </Button>
            <DeleteButton
              isLoading={false}
              onDelete={() => mutation.mutate(application._id!)}
            />
          </HStack>
        </CardFooter>
      </Card>
    </>
  )
}
const ApplicationsCards = () => {
  const { state } = useJobs()

  return (
    <SimpleGrid
      mx='5'
      spacing={4}
      templateColumns='repeat(auto-fill, minmax(25rem, 1fr))'
      display={['block', 'block', 'none']}
    >
      {state.applications?.map((application, index) => (
        <ApplicationsCard key={application._id} application={application} />
      ))}
    </SimpleGrid>
  )
}

export default ApplicationsCards
