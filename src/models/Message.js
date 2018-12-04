import { observable, computed } from 'mobx'
import * as mobx from 'mobx'

export class Message {

  @observable _id = ''
  @observable text = ''
  @observable createdAt = new Date()
  @observable user = {}
}

export class Messages {

  @observable messageList = []
  @observable loadEarlier = true
  @observable typingText = ''
  @observable isLoadingEarlier = false
  @observable isOpen = false
  @observable selectedItem = 'About'

  constructor () {
    mobx.autorun(() => console.log(this.messageList))
  }

  addMessage (message) {
    this.messageList.push(message)
  }

  @computed get getMessage () {
    return this.messageList
  }

  toggleOpen (isOpen) {
    if (null === isOpen) {
      this.isOpen = !this.isOpen
    } else {
      this.isOpen = isOpen
    }
  }
}