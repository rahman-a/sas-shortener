import { useState, useContext } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import { Grid, GridItem } from '@chakra-ui/react'
import { userContext } from './context/user'
import URLContextProvider from './context/url'

function App() {
  const { isAuthenticated } = useContext(userContext)
  return (
    <div className='App'>
      {isAuthenticated ? (
        <Grid minHeight='100vh' gridTemplateRows='3rem 1fr'>
          <GridItem bg='#1e95e0'>
            <Header />
          </GridItem>
          <GridItem>
            <URLContextProvider>
              <Dashboard />
            </URLContextProvider>
          </GridItem>
        </Grid>
      ) : (
        <Grid placeItems='center' minHeight='100vh' bg='#1e95e0'>
          <GridItem>
            <Login />
          </GridItem>
        </Grid>
      )}
    </div>
  )
}

export default App
