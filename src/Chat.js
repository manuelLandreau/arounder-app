import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat'
import SlackMessage from './components/SlackMessage'
import Icon from 'react-native-vector-icons/Ionicons'
import emojiUtils from 'emoji-utils'
import { MenuContext } from 'react-native-menu'
import SideMenu from 'react-native-side-menu'
import LeftMenu from './components/LeftMenu'
import RightMenu from './components/RightMenu'
import { Spinner } from './components/common'
import { removeItem } from './helpers/storage'
import getLocationAsync from './helpers/location'

@observer
export default class Chat extends Component {

  constructor (props) {
    super(props)

    this.state = {
      messages: [],
      isLoading: true,
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      isLeftMenuOpen: false,
      isRightMenuOpen: false,
      selectedItem: 'About',
      selectedPlace: '',
      olderMessageDate: new Date(),
      places: [],
      placeName: '',
      placeId: ''
    }

    this.user = this.props.store.user

    this.toggleLeftMenu = this.toggleLeftMenu.bind(this)
    this.toggleRightMenu = this.toggleRightMenu.bind(this)
    this.onSend = this.onSend.bind(this)
    this.onReceive = this.onReceive.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.renderSystemMessage = this.renderSystemMessage.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.onLoadEarlier = this.onLoadEarlier.bind(this)
    this.onPlaceSelected = this.onPlaceSelected.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentWillMount () {
    // GPS init // setTimeOut
    getLocationAsync().then(({latitude, longitude}) =>
      this.props.store.auth.sCluster.emit('neabyPlaces', {latitude, longitude}))

    // Nearby request
    this.props.store.auth.sCluster.on('neabyPlaces', (places) => {
      console.log(places)

      // Case places around here
      if (places.length > 0) {
        // Channel title
        this.setState({places, placeId: places[0].placeId, placeName: '# ' + places[0].placeName})

        const subscribedChannel = this.placeSubscribe(places[0])
        subscribedChannel.on('subscribe', (channel) => this.onSubscribe(channel))

        // Update the UI with new messages.
        subscribedChannel.watch(text => this.onReceive(text))

        this.setState({isLoading: false})
      } else {
        // Case no places around here, re-check again with fresh coords data
        getLocationAsync().then(({latitude, longitude}) => {
          // setTimeout(() => this.props.store.auth.sCluster.emit('neabyPlaces', {latitude, longitude}), 1000);
        })
      }
    })

    // Automatic fetch of the last 10 messages
    this.props.store.auth.sCluster
      .on('oldMessages', messages => {
        if (messages.length > 0) {
          const i = messages.length - 1
          this.setState({messages, olderMessageDate: messages[i].createdAt})
        }
        this.setState({isLoading: false})
      })

    // Manual fetch of 10 older messages
    this.props.store.auth.sCluster
      .on('olderMessages', messages => {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, messages),
            loadEarlier: !(messages.length < 10),
            isLoadingEarlier: false
          }
        })
        if (!!messages[0]) {
          const i = messages.length - 1
          this.setState({olderMessageDate: messages[i].createdAt})
        }
      })
  }

  placeSubscribe (place) {
    this.props.store.auth.sCluster.emit('channelRequest', place.placeId)
    this.setState({placeName: '#' + place.placeName})

    return this.props.store.auth.sCluster
      .subscribe(place.placeId, {waitForAuth: true})
  }

  onSubscribe (channel) {
    this.setState({messages: []})

    this.props.store.auth.sCluster.emit('oldMessages', {channel})

    // Bind welcome message & ads
    this.setState(() => {
      return {
        messages: [{_id: '1', text: 'Welcome on ' + this.state.placeName, user: {_id: '1'}}]
      }
    })
  }

  onLoadEarlier () {
    const date = this.state.olderMessageDate
    this.setState(() => {
      this.props.store.auth.sCluster
        .emit('olderMessages', {channel: this.state.placeId, date})
      return {
        isLoadingEarlier: true,
      }
    })
  }

  // todos : avoid array index 0
  onSend (message = []) {
    if (message[0].text.length > 0) {
      this.props.store.auth.sCluster
        .publish(this.state.placeId, message[0], () => console.log('send', message))
    }
  }

  onReceive (message) {
    console.log('onReceive', message)

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, message),
      }
    })
  }

  renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    )
  }

  renderSystemMessage (props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    )
  }

  renderFooter () {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      )
    }
    return null
  }

  renderMessage (props) {
    const {currentMessage: {text: currText}} = props

    let messageTextStyle

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      }
    }

    return (
      <SlackMessage {...props} messageTextStyle={messageTextStyle}/>
    )
  }

  logout () {
    removeItem('jwt').then(() => {
      this.props.store.auth.isLoggedIn = false
      if (this.props.store.auth.sCluster) {
        this.props.store.auth.sCluster.unsubscribe(this.state.placeId)
        this.props.store.auth.sCluster.emit('disconnect')
      }
    })
  }

  toggleLeftMenu () {
    this.setState({
      isLeftMenuOpen: !this.state.isLeftMenuOpen,
    })
  }

  toggleRightMenu () {
    this.setState({
      isRightMenuOpen: !this.state.isRightMenuOpen,
    })
  }

  updateLeftMenuState (isLeftMenuOpen) {
    this.setState({isLeftMenuOpen})
  }

  updateRightMenuState (isRightMenuOpen) {
    this.setState({isRightMenuOpen})
  }

  onPlaceSelected = place => {
    this.setState({isLoading: true, isLeftMenuOpen: false})
    this.props.store.auth.sCluster.unsubscribe(this.state.placeId)
    const newChannel = this.placeSubscribe(place)
    newChannel.on('subscribe', (channel) => this.onSubscribe(channel))
    newChannel.watch(text => this.onReceive(text))
    this.setState({isLoading: false})
  }

  render () {
    return (
      <SideMenu menu={<LeftMenu onPlacesSelected={this.onPlaceSelected} places={this.state.places}/>}
                isOpen={this.state.isLeftMenuOpen}
                onChange={isOpen => this.updateLeftMenuState(isOpen)}>
        <MenuContext style={{
          flex: 1,
          overflow: 'visible',
          zIndex: 1,
          backgroundColor: '#fff'
        }}>
          <SideMenu menu={<RightMenu onLogout={this.logout}/>}
                    menuPosition="right"
                    isOpen={this.state.isRightMenuOpen}
                    onChange={isOpen => this.updateRightMenuState(isOpen)}>
            <MenuContext style={{
              flex: 1,
              overflow: 'visible',
              zIndex: 1,
              backgroundColor: '#fff'
            }}>
              <View style={{flexDirection: 'row', height: 58, padding: 15, backgroundColor: '#1976D2'}}>
                <Icon onPress={this.toggleLeftMenu} name="md-globe" style={{flex: 2, fontSize: 28, color: '#fff'}}/>
                <Text style={{flex: 8, fontSize: 20, color: '#fff'}}>{this.state.placeName}</Text>
                <Icon onPress={this.toggleRightMenu} name="md-contact" style={{fontSize: 28, color: '#fff'}}/>
              </View>
              {this.state.isLoading ? <Spinner/> : <GiftedChat
                showAvatarForEveryMessage={true}
                style={{backgroundColor: '#ffffff'}}
                messages={this.state.messages}
                renderMessage={this.renderMessage}
                onSend={this.onSend}
                loadEarlier={this.state.loadEarlier}
                onLoadEarlier={this.onLoadEarlier}
                isLoadingEarlier={this.state.isLoadingEarlier}
                // user={this.props.store.user}
                user={{
                  _id: '1234567890',
                  name: 'manu',
                  avatar: 'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2016%2F08%2F20%2F05%2F38%2Favatar-1606916_640.png&f=1'
                }}
                renderBubble={this.renderBubble}
                renderSystemMessage={this.renderSystemMessage}
                renderFooter={this.renderFooter}
              />}
            </MenuContext>
          </SideMenu>
        </MenuContext>
      </SideMenu>
    )
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  footerText: {
    fontSize: 14,
    color: '#aaa'
  },
})
