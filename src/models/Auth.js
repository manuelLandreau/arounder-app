import { observable } from 'mobx'

export class Auth {

  @observable isLoggedIn = false
  @observable isLoading = false
  @observable error = ''
  @observable token = ''
  @observable sCluster = null
}