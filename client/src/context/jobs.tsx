import { createContext, useReducer, useContext } from 'react'
import type { Job, Applications } from '../types'

type Status = Applications['status']
type StatusPayload = { _id: string; status: Status }
interface JobsState {
  jobs: Job[]
  applications: Applications[]
}

interface JobsContextProps {
  state: JobsState
  dispatch: React.Dispatch<Actions>
}

export enum ActionTypes {
  GET_JOBS = 'GET_JOBS',
  DELETE_JOB = 'DELETE_JOB',
  UPDATE_JOB = 'UPDATE_JOB',
  GET_APPLICATIONS = 'GET_APPLICATIONS',
  UPDATE_STATUS = 'UPDATE_STATUS',
  DELETE_APPLICATION = 'DELETE_APPLICATION',
}

type Actions =
  | { type: ActionTypes.GET_JOBS; payload: Job[] }
  | { type: ActionTypes.DELETE_JOB; payload: string }
  | { type: ActionTypes.UPDATE_JOB; payload: Job }
  | { type: ActionTypes.GET_APPLICATIONS; payload: Applications[] }
  | { type: ActionTypes.UPDATE_STATUS; payload: StatusPayload }
  | { type: ActionTypes.DELETE_APPLICATION; payload: string }

interface JobsProviderProps {
  children: JSX.Element | JSX.Element[]
}

const jobsContext = createContext<JobsContextProps>({
  state: {} as JobsState,
  dispatch: (action: Actions) => null,
})

export const useJobs = () => useContext(jobsContext)

const jobsReducer = (state: JobsState, action: Actions) => {
  switch (action.type) {
    case ActionTypes.GET_JOBS:
      return {
        ...state,
        jobs: action.payload,
      }
    case ActionTypes.DELETE_JOB:
      return {
        ...state,
        jobs: state.jobs.filter((job) => job._id !== action.payload),
      }
    case ActionTypes.UPDATE_JOB:
      return {
        ...state,
        jobs: state.jobs.map((job) => {
          if (job._id === action.payload._id) {
            return action.payload
          }
          return job
        }),
      }
    case ActionTypes.GET_APPLICATIONS:
      return {
        ...state,
        applications: action.payload,
      }
    case ActionTypes.UPDATE_STATUS:
      return {
        ...state,
        applications: state.applications.map((application): Applications => {
          if (application._id === action.payload._id) {
            return {
              ...application,
              status: action.payload.status as Status,
            }
          }
          return application
        }),
      }
    case ActionTypes.DELETE_APPLICATION:
      console.log('reducer:', action.payload)
      return {
        ...state,
        applications: state.applications.filter(
          (app) => app._id !== action.payload
        ),
      }
    default:
      return state
  }
}

export default function JobsProvider({ children }: JobsProviderProps) {
  const [state, dispatch] = useReducer(jobsReducer, {
    jobs: [],
    applications: [],
  } as JobsState)

  return (
    <jobsContext.Provider value={{ state, dispatch }}>
      {children}
    </jobsContext.Provider>
  )
}
