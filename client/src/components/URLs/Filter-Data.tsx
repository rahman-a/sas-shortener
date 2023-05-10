import React, { FC, FormEvent } from 'react'
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
  StackDivider,
} from '@chakra-ui/react'
import { URLsQueries } from '../../types'

interface FilterDataProps {
  isOpen: boolean
  onClose: () => void
  queries: URLsQueries
  setQueries: React.Dispatch<React.SetStateAction<URLsQueries>>
}

const FilterData: FC<FilterDataProps> = ({
  isOpen,
  onClose,
  queries,
  setQueries,
}) => {
  const filterHandler = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setQueries({ ...queries, [name]: value })
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay minHeight='100vh' width='100%' bottom='0' height='unset' />
      <ModalContent>
        <ModalHeader>Filter Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} divider={<StackDivider />}>
            <FormControl>
              <Input
                type='text'
                name='original_url'
                placeholder='Filter by original url'
                onChange={(e) => filterHandler(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='text'
                name='shortId'
                placeholder='Filter by short url id'
                onChange={(e) => filterHandler(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='number'
                name='clicks'
                placeholder='Filter by clicks count'
                onChange={(e) => filterHandler(e)}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='ghost' mr={3} color='black' onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FilterData
