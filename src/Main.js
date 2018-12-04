import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { observer } from 'mobx-react'
import { Spinner } from './components/common/index'
import Login from './Login'
import Chat from './Chat'
import { getItem } from './helpers/storage'
import { initSCluster } from './socketCluster'
import { Constants } from 'expo'
import { messages } from './models'

@observer
export default class Main extends Component {

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    // getItem('jwt').then((token) => {
    //     if (token) {
    //         initSCluster().then(sCluster => {
    //             this.props.store.auth.setSCluster(sCluster);
    //             sCluster.authenticate(token, err => {
    //                 if (err) {
    //                     sCluster.emit('disconnect');
    //                     this.props.store.auth.setLoggedIn(false);
    //                 } else {
    //                     this.props.store.auth.setLoggedIn(true);
    //                 }
    //             });
    //
    //             this.props.store.auth.sCluster.emit('userInfo');
    //
    //             this.props.store.auth.sCluster.on('userInfo', (user) => {
    //                 console.log('userInfo', user);
    //                 if (user && user.uid) this.props.store.setUser(user);
    //             });
    //         });
    //     } else {
    //         this.props.store.auth.setLoggedIn(false);
    //     }
    // }).catch(() => this.props.store.auth.setLoggedIn(false));

    initSCluster().then(sCluster => {
      sCluster.on('connect', (status) => {
        this.props.store.auth.sCluster = sCluster
        this.props.store.auth.isLoggedIn = !!status.isAuthenticated
      })
    })
  }

  renderContent () {
    switch (this.props.store.auth.isLoggedIn) {
      case true:
        return <Chat store={this.props.store}/>
      case false:
        return <Login store={this.props.store}/>
      default:
        return <Spinner size="large"/>
    }
  }

  render () {
    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight}}>
        {this.renderContent()}
      </View>
    )
  }
}