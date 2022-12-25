import { FC, FormEvent, useEffect, useState } from 'react'
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
import { ApplicationsQuery } from '../../types'
import countries from '../../data/countries.json'

interface FilterDataProps {
  isOpen: boolean
  onClose: () => void
  queryData: ApplicationsQuery
  setQueryData: React.Dispatch<React.SetStateAction<ApplicationsQuery>>
}

const FilterData: FC<FilterDataProps> = ({
  isOpen,
  onClose,
  queryData,
  setQueryData,
}) => {
  const getQueriesFilter = (
    e: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault()
    setQueryData({
      ...queryData,
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
                name='applicationId'
                placeholder='Filter by Application Id'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='text'
                name='job'
                placeholder='Filter by Job Id'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='text'
                name='firstName'
                placeholder='Filter by First Name'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='text'
                name='lastName'
                placeholder='Filter by Last Name'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <FormControl>
              <Input
                type='text'
                name='email'
                placeholder='Filter by E-mail address'
                onChange={(e) => getQueriesFilter(e)}
              />
            </FormControl>
            <Select
              display='inline-block'
              mr='5'
              mb={['5', '0', '0']}
              name='status'
              value={queryData?.status}
              onChange={(e) => getQueriesFilter(e)}
            >
              <option value=''>Filter by Applicant Status</option>
              <option value='applied'>Applied</option>
              <option value='interviewing'>Interviewing</option>
              <option value='offered'>Offered</option>
              <option value='rejected'>Rejected</option>
            </Select>
            <Select
              display='inline-block'
              mr='5'
              mb={['5', '0', '0']}
              value={queryData?.country}
              name='country'
              onChange={(e) => getQueriesFilter(e)}
            >
              <option value=''>Filter by Country</option>
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
