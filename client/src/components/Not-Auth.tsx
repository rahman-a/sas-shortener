import { Helmet } from 'react-helmet-async'
import {
  Container,
  Flex,
  Box,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

interface NotAuthProps {
  title: string
  header: string
}

const NotAuth = ({ title, header }: NotAuthProps) => {
  return (
    <Container maxW='container.xl' padding={{ sm: 0 }}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Flex direction='column'>
        <Box mb='5'>
          <Heading size='lg' color='blackAlpha.400'>
            {header}
          </Heading>
        </Box>
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>Not Authorized</AlertTitle>
          <AlertDescription>
            You are not authorized to view this page.
          </AlertDescription>
        </Alert>
      </Flex>
    </Container>
  )
}

export default NotAuth
