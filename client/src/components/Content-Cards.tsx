import React from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import ContentCard from './Content-Card'
import { useURLContext } from '../context/url'

const ContentCards = () => {
  const { state } = useURLContext()
  return (
    <SimpleGrid
      mx='5'
      spacing={4}
      templateColumns='repeat(auto-fill, minmax(25rem, 1fr))'
      display={['block', 'block', 'none']}
    >
      {state.urls?.map((url, index) => (
        <ContentCard key={url.short} content={url} />
      ))}
    </SimpleGrid>
  )
}

export default ContentCards
