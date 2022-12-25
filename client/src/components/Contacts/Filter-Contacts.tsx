import React, { FC, FormEvent, useEffect, useState } from 'react'
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
  Select,
} from '@chakra-ui/react'
import { ContactsQueries } from '../../types'
import countries from '../../data/countries.json'

interface FilterDataProps {
  isOpen: boolean
  onClose: () => void
  queries: ContactsQueries
  setQueries: React.Dispatch<React.SetStateAction<ContactsQueries>>
}

const FilterData: FC<FilterDataProps> = ({
  isOpen,
  onClose,
  queries,
  setQueries,
}) => {
  const getQueriesFilter = (
    e: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault()
    setQueries({
      ...queries,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
      <ModalOverlay minHeight='100vh' width='100%' bottom='0' height='unset' />
      <ModalContent>
        <ModalHeader>Filter Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} divider={<StackDivider />}>
            <FormControl>
              <Input
                type='text'
                name='name'
                placeholder='Filter by contact name'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='email'
                name='email'
                placeholder='Filter by contact email'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='tel'
                name='phone'
                placeholder='Filter by contact phone'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='text'
                name='organization'
                placeholder='Filter by contact organization'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='text'
                name='role'
                placeholder='Filter by contact organization role'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='text'
                name='role'
                placeholder='Filter by contact organization role'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <Select
              display='inline-block'
              mr='5'
              mb={['5', '0', '0']}
              name='inquiry'
              value={queries?.inquiry}
              onChange={(e) => getQueriesFilter(e)}
            >
              <option value=''>Filter by Inquiry Type</option>
              <option value='general'>General business query</option>
              <option value='proposal'>Request for proposal</option>
              <option value='employment'>Employment</option>
            </Select>
            <Select
              display='inline-block'
              mr='5'
              mb={['5', '0', '0']}
              value={queries?.location}
              name='location'
              onChange={(e) => getQueriesFilter(e)}
            >
              <option value=''>Filter by Location</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Select>
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
