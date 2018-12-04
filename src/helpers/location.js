import { Location, Permissions } from 'expo'

export default () => {
  return new Promise((resolve, reject) => {
    Permissions.askAsync(Permissions.LOCATION).then(({status}) => {
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        reject()
      }

      Location.getCurrentPositionAsync({}).then(location => resolve(location.coords))
    })
  })
};