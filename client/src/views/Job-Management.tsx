import {
  Box,
  Flex,
  Container,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import { Helmet } from 'react-helmet-async'
import { useUserContext } from '../context/user'
import { isAuthorized } from '../utils'
import JobsData from '../components/Jobs/Jobs-Data'
import ApplicationsData from '../components/Applications/Applications-Data'
import NewJob from '../components/Jobs/New-Job'
import NotAuth from '../components/Not-Auth'

const JobManagement = () => {
  const { roles } = useUserContext()
  if (!isAuthorized(roles, 'manage_jobs')) {
    return <NotAuth title='Job Management' header='Jobs Management Panel' />
  }
  return (
    <Container maxW='container.xl' padding={{ sm: 0 }}>
      <Helmet>
        <title>Job Management</title>
      </Helmet>
      <Flex direction='column'>
        <Box mb='5'>
          <Heading size='lg' color='blackAlpha.400'>
            Jobs Management Panel
          </Heading>
        </Box>
        <Tabs isFitted variant='enclosed-colored'>
          <TabList mb='1em'>
            <Tab>Create new job</Tab>
            <Tab>Jobs List</Tab>
            <Tab>Applications List</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <NewJob />
            </TabPanel>
            <TabPanel>
              <JobsData />
            </TabPanel>
            <TabPanel>
              <ApplicationsData />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Container>
  )
}

export default JobManagement
