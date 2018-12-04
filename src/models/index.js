import { Auth } from './Auth'
import { User } from './User'
import { Messages } from './Message'
import { Location } from './Location'

export const store = {
  auth: new Auth(),
  user: new User(),
  location: new Location()
}

export const messages = new Messages()