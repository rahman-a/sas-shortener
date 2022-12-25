export const rootURL = '/api/v1'

import urlsApi from './urls'
import userApi from './users'
import contactsApi from './contacts'
import jobsApi from './jobs'
import applicationsApi from './applications'

export default {
  ...urlsApi,
  ...userApi,
  ...contactsApi,
  ...jobsApi,
  ...applicationsApi,
}
