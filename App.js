import React, {Component} from 'react';
import {Platform, AppRegistry} from 'react-native';
import Main from './src/Main';
import {store} from './src/models';
import {Constants, Location, Permissions} from 'expo';

export default class App extends Component {

    componentWillMount() {
        // if (Platform.OS === 'android' && !Constants.isDevice) {
        //     console.log('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
        // } else {
        //     this.getLocationAsync();
        // }
      this.getLocationAsync();
    }

    getLocationAsync = async () => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});

        console.log(location.coords);

        store.location.latitude = location.coords.latitude;
        store.location.longitude = location.coords.longitude;
    };

    render() {
        return (
            <Main store={store}/>
        );
    }
}

AppRegistry.registerComponent('app', () => Main);
