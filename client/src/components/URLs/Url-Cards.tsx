import React from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import ContentCard from './Url-Card'
import { useURLContext } from '../../context/url'

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
        <ContentCard key={url._id} content={url} />
      ))}
    </SimpleGrid>
  )
}

export default ContentCards
