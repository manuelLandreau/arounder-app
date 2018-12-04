import { observable, action } from 'mobx'

export class User {

  @observable _id = ''
  @observable email = ''
  @observable name = ''
  @observable avatar = ''

  @action setUser (user) {
    this._id = user.uid
    this.email = user.email
    this.name = user.displayName
    this.avatar = user.photoURL
  }
}