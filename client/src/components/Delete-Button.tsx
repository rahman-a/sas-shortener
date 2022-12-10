import React, { useEffect, useRef } from 'react'
import {
  Popover,
  PopoverTrigger,
  Portal,
  PopoverCloseButton,
  PopoverContent,
  PopoverBody,
  HStack,
  Box,
  Button,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

interface DeleteButtonProps {
  onDelete: () => void
  isLoading: boolean
}

const DeleteButton = ({ onDelete, isLoading }: DeleteButtonProps) => {
  const initRef = useRef<HTMLButtonElement>(null)
  return (
    <Popover closeOnBlur={false} placement='top' initialFocusRef={initRef}>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <IconButton
              aria-label='Delete'
              icon={<DeleteIcon />}
              color='red.500'
              size={'sm'}
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverCloseButton />
              <PopoverBody>
                <Box>
                  Are you sure you want to delete this URL? This action cannot
                  be undone.
                </Box>
                <HStack spacing={4}>
                  <Button
                    mt={4}
                    width='5rem'
                    colorScheme='red'
                    onClick={onDelete}
                    ref={initRef}
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner size='sm' /> : 'Delete'}
                  </Button>
                  <Button
                    colorScheme='gray'
                    onClick={onClose}
                    ref={initRef}
                    mt='auto !important'
                    disabled={isLoading}
                  >
                    Close
                  </Button>
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  )
}

export default DeleteButton
