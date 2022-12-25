import React from 'react'
import { Grid, GridItem, Flex, Container } from '@chakra-ui/react'
import Header from './Header'
import URLContextProvider from '../context/url'
import UserContextProvider from '../context/user'
import ContactsContextProvider from '../context/contacts'
import JobContextProvider from '../context/jobs'

interface LayoutProps {
  children: JSX.Element | JSX.Element[]
  context?: string
}

interface RenderedContext {
  [key: string]: React.ReactNode
}

const Layout = ({ children, context }: LayoutProps) => {
  const Component: RenderedContext = {
    user: <UserContextProvider>{children}</UserContextProvider>,
    url: <URLContextProvider>{children}</URLContextProvider>,
    contact: <ContactsContextProvider>{children}</ContactsContextProvider>,
    job: <JobContextProvider>{children}</JobContextProvider>,
  }
  return (
    <Grid minHeight='100vh' gridTemplateRows='auto 1fr'>
      <GridItem>
        <Header />
      </GridItem>
      <GridItem>
        <Flex alignItems='center' direction='column' py='10' height='100%'>
          <Container maxW='container.xl' p={{ sm: 0 }}>
            {context ? Component[context as keyof RenderedContext] : children}
          </Container>
        </Flex>
      </GridItem>
    </Grid>
  )
}

export default Layout
