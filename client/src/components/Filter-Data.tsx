import React, { FC, useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalCloseButton,
  FormControl,
  Input,
  Button,
  VStack,
  Spinner,
  StackDivider,
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { filterUrls } from '../api'
import { useURLContext, ActionType } from '../context/url'

interface FilterDataProps {
  isOpen: boolean
  onClose: () => void
}

interface FilterData {
  destination?: string
  short?: string
  clicks?: string
}

const FilterData: FC<FilterDataProps> = ({ isOpen, onClose }) => {
  const [destination, setDestination] = useState<string>('')
  const [short, setShort] = useState<string>('')
  const [clicks, setClicks] = useState<string>('')
  const [isFilterData, setIsFilterData] = useState<boolean>(false)
  const { dispatch } = useURLContext()
  const mutation = useMutation(filterUrls, {
    onSuccess: (data) => {
      dispatch({ type: ActionType.GET_URLS, payload: data.urls })
      onClose()
      resetHandler()
    },
  })
  const filterHandler = () => {
    let query: FilterData = {}
    if (destination) query['destination'] = destination
    if (short) query['short'] = short
    if (clicks) query['clicks'] = clicks
    mutation.mutate(query)
  }

  const resetHandler = () => {
    setDestination('')
    setShort('')
    setClicks('')
  }

  useEffect(() => {
    if (destination || short || clicks) {
      setIsFilterData(true)
    } else {
      setIsFilterData(false)
    }
  }, [destination, short, clicks])
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay minHeight='100vh' width='100%' bottom='0' height='unset' />
      <ModalContent>
        <ModalHeader>Filter Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} divider={<StackDivider />}>
            <FormControl isDisabled={mutation.isLoading}>
              <Input
                type='text'
                placeholder='Filter by destination url'
                onChange={(e) => setDestination(e.target.value)}
              />
            </FormControl>
            <FormControl isDisabled={mutation.isLoading}>
              <Input
                type='text'
                placeholder='Filter by short url id'
                onChange={(e) => setShort(e.target.value)}
              />
            </FormControl>
            <FormControl isDisabled={mutation.isLoading}>
              <Input
                type='number'
                placeholder='Filter by clicks count'
                onChange={(e) => setClicks(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={!isFilterData}
            colorScheme='blue'
            width='5rem'
            mr={3}
            isLoading={mutation.isLoading}
            onClick={filterHandler}
          >
            Filter
          </Button>
          <Button colorScheme='ghost' mr={3} color='black' onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FilterData
