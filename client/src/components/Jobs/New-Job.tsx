import {
  useState,
  useRef,
  useCallback,
  SyntheticEvent,
  FormEvent,
  useEffect,
} from 'react'
import { nanoid } from 'nanoid'
import type { Job } from '../../types'
import parser from 'html-react-parser'
import {
  Flex,
  Box,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  RadioGroup,
  Radio,
  VStack,
  StackDivider,
  Button,
  Text,
  Heading,
  Wrap,
  WrapItem,
  useToast,
  ToastId,
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import api from '../../api'
import TagInput from '../Tag-Input'
import RichTextEditor from './RichText-Editor'
import countries from '../../data/countries.json'

const textEditorConfig = {
  buttons: [
    'bold',
    'italic',
    'underline',
    'ul',
    'ol',
    'fontsize',
    'link',
    'align',
    'undo',
    'redo',
    'hr',
  ],
}

const NewJob = () => {
  const [jobDescription, setJobDescription] = useState<string>('')
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const toastIdRef = useRef<ToastId>()
  const toast = useToast()
  const [jobData, setJobData] = useState<Job>({
    jobId: nanoid(10),
    title: '',
    company: 'SAS',
    jobType: '',
    country: '',
    salary: 0,
  } as Job)
  const [skills, setSkills] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSkillInputFocused, setIsSkillInputFocused] = useState(false)
  const mutation = useMutation(api.createJob, {
    onSuccess: () => {
      setIsLoading(false)
      resetStates()
      showAlertToast()
    },
    onError: (error: { message: string }) => {
      setIsLoading(false)
      showAlertToast(error.message)
    },
  })
  const handleInputChange = useCallback(
    (event: FormEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.currentTarget
      setJobData((prev) => ({ ...prev, [name]: value }))
    },
    []
  )
  const handleSalaryAndJobTypeChange = useCallback(
    (data: { name: string; value: string }) => {
      const { name, value } = data
      setJobData((prev) => ({ ...prev, [name]: value }))
    },
    []
  )
  const handleSkillsChange = useCallback(
    (e: SyntheticEvent, skills: string[]) => {
      setSkills(skills)
    },
    []
  )

  const showAlertToast = (error?: string) => {
    if (error) {
      toast({
        title: 'An error occurred.',
        description: error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      return
    }
    toastIdRef.current = toast({
      title: 'Job posted successfully',
      description: 'Your job has been posted successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  const resetStates = () => {
    setJobDescription('')
    setSkills([])
    setJobData({
      jobId: nanoid(10),
      title: '',
      company: 'SAS',
      jobType: '',
      country: '',
      salary: 0,
    } as Job)
  }
  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault()
    if (isSkillInputFocused) return
    setIsLoading(true)
    mutation.mutate({ ...jobData, skills, description: jobDescription } as Job)
  }
  useEffect(() => {
    if (
      jobData.title &&
      jobData.jobType &&
      jobData.country &&
      jobDescription.length > 100 &&
      skills.length > 0
    )
      setIsSubmitDisabled(false)
    else setIsSubmitDisabled(true)
  }, [jobDescription, jobData, skills])
  return (
    <form onSubmit={onSubmitHandler}>
      <Text my='5'>
        Required filed are marked with &nbsp;
        <Text as='span' color='red'>
          *
        </Text>
      </Text>
      <Flex direction='column'>
        <VStack
          mb='5'
          spacing='5'
          divider={<StackDivider borderColor='gray.200' />}
        >
          <Stack
            spacing='5'
            width='100%'
            direction={['column', 'column', 'row']}
          >
            <FormControl id='jobId' isDisabled flexGrow='1' width='auto'>
              <FormLabel>#JobID</FormLabel>
              <Input type='text' value={jobData.jobId} />
            </FormControl>
            <FormControl isRequired id='jobTitle' flexGrow='8' width='auto'>
              <FormLabel>Job Title</FormLabel>
              <Input
                type='text'
                value={jobData.title}
                name='title'
                onChange={(e) => handleInputChange(e)}
              />
            </FormControl>
          </Stack>
          <Stack
            spacing='5'
            width='100%'
            direction={['column', 'column', 'row']}
          >
            <FormControl isRequired id='jobCompany'>
              <FormLabel>Company Branch</FormLabel>
              <Input
                type='text'
                value={jobData.company}
                title='company'
                onChange={(e) => handleInputChange(e)}
              />
            </FormControl>
            <FormControl isRequired id='jobType'>
              <FormLabel>Job Type</FormLabel>
              <RadioGroup
                placeholder='Select option'
                title='jobType'
                value={jobData.jobType}
                onChange={(e) =>
                  handleSalaryAndJobTypeChange({ name: 'jobType', value: e })
                }
              >
                <Stack
                  flexWrap='wrap'
                  direction={['column', 'column', 'row', 'row']}
                >
                  <Radio value='full time'>Full Time</Radio>
                  <Radio mt='3' value='part time'>
                    Part Time
                  </Radio>
                  <Radio mt='3' value='internship'>
                    Internship
                  </Radio>
                  <Radio mt='3' value='contract'>
                    Contract
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Stack>
          <Stack
            spacing='5'
            width='100%'
            direction={['column', 'column', 'row']}
          >
            <FormControl isRequired id='jobLocation'>
              <FormLabel>Job Location</FormLabel>
              <Select
                placeholder='Select option'
                name='country'
                value={jobData.country}
                onChange={(e) => handleInputChange(e)}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id='jobSalary'>
              <FormLabel>Job Salary</FormLabel>
              <NumberInput
                defaultValue={0}
                min={0}
                max={1000000}
                title='salary'
                value={jobData.salary}
                onChange={(e) =>
                  handleSalaryAndJobTypeChange({ name: 'salary', value: e })
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Stack>
          <Stack width='100%'>
            <FormControl id='skills'>
              <FormLabel>
                Job Skills <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <TagInput
                tags={skills}
                onTagsChange={handleSkillsChange}
                colorScheme='blue'
                onFocus={() => setIsSkillInputFocused(true)}
                onBlur={() => setIsSkillInputFocused(false)}
              />
              <FormHelperText>Press enter to add a new skill</FormHelperText>
            </FormControl>
          </Stack>
          <Stack width='100%' direction='column'>
            <FormControl isRequired id='jobDescription'>
              <FormLabel>Job Description</FormLabel>
              <RichTextEditor
                setDescription={setJobDescription}
                description={jobDescription}
                config={textEditorConfig}
              />
              <FormHelperText fontWeight='500'>
                Description must be more than 100 characters
              </FormHelperText>
            </FormControl>
            <VStack align='flex-start' spacing='5'>
              <Heading size='sm' mt='5'>
                Job Description Preview
              </Heading>
              <Box
                width='100%'
                border='1px solid'
                borderColor='gray.200'
                borderRadius='md'
                p='1rem 2rem'
              >
                <Text fontSize='md'>{parser(jobDescription)}</Text>
              </Box>
            </VStack>
          </Stack>
        </VStack>
      </Flex>
      <Wrap direction='column' justify='flex-start' mt='5'>
        <WrapItem>
          <Button
            type='submit'
            colorScheme='blue'
            variant='outline'
            size='lg'
            disabled={isSubmitDisabled || isLoading}
            isLoading={isLoading}
            loadingText='Submitting'
          >
            Submit
          </Button>
        </WrapItem>
        {isSubmitDisabled && (
          <WrapItem>
            <Text color='red'>Please fill the required fields</Text>
          </WrapItem>
        )}
      </Wrap>
    </form>
  )
}

export default NewJob
