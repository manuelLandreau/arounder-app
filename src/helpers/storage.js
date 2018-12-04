import { AsyncStorage } from 'react-native'

export async function setItem (key, value) {
  try {
    return await AsyncStorage.setItem(key, value)
  } catch (error) {
    // Error saving data
  }
}

export async function getItem (key) {
  try {
    return await AsyncStorage.getItem(key)
  } catch (error) {
    // Error saving data
  }
}

export async function removeItem (key) {
  try {
    return await AsyncStorage.removeItem(key)
  } catch (error) {
    // Error saving data
  }
}