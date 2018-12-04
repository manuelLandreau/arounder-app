import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { setItem } from './helpers/storage'
import { initSCluster } from './socketCluster'
import AuthScreen from './containers/AuthScreen'
import HomeScreen from './containers/HomeScreen'

@observer
export default class Login extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isAppReady: false
    }
  }

  onLogin (login, password) {
    const credentials = { login, password }

    console.log(login, password)

    this.props.store.auth.isLoading = true

    // initSCluster().then(sCluster => {
    //     this.props.store.auth.setSCluster(sCluster);
    if (this.props.store.auth.sCluster) {
      initSCluster().then(sCluster => {
        this.props.store.auth.sCluster = sCluster
        sCluster.emit('login', credentials, err => {
          if (err) {
            this.onLoginFailed(err)
          } else {
            this.onLoginSuccess()
          }
        })
      })
    } else {
      this.props.store.auth
        .sCluster.emit('login', credentials, err => err ? this.onLoginFailed(err) : this.onLoginSuccess())
    }
    // });
  }

  onRegister (email, password, username) {
    const credentials = {username, email, password}

    this.props.store.auth.isLoading = true

    initSCluster().then(sCluster => {
      this.props.store.auth.sCluster = sCluster
      sCluster.emit('register', credentials, (err) => {
        if (err) {
          this.onLoginFailed(err)
        } else {
          this.onLoginSuccess(sCluster)
        }
      })
    })
  }

  onLoginFailed (error) {
    this.props.store.auth.isLoggedIn = false
    this.props.store.auth.error = 'Authentification Failed.'
    console.log('Authentification Failed: ', error)
    this.props.store.auth.isLoading = false
  }

  onLoginSuccess () {
    // const token = this.props.store.auth.sCluster.getSignedAuthToken();
    //
    // console.log('token', token);
    // setItem('jwt', token).then(() => {
    this.props.store.auth.isLoggedIn = true
    this.props.store.auth.isError = ''
    this.props.store.auth.isLoading = false
    // this.props.store.auth.setToken(token);
    //     }
    // );
  }

  render () {
    if (this.state.isAppReady) {
      return (
        <HomeScreen
          logout={() => {
            this.props.store.auth.isLoggedIn = false
            this.setState({isAppReady: false})
          }}
        />
      )
    } else {
      return (
        <AuthScreen
          login={this.onLogin.bind(this)}
          signup={this.onRegister.bind(this)}
          isLoggedIn={this.props.store.auth.isLoggedIn}
          isLoading={this.props.store.auth.isLoading}
          onLoginAnimationCompleted={() => this.setState({isAppReady: true})}
        />
      )
    }
  }
}