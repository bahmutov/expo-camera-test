import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera'

if (window.Cypress) {
  // expose the Camera reference through the window object
  // so it is reachable from Cypress test
  window.__Camera = Camera
  console.log('window.__Camera is available')
}

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === null) {
    return <Text testID="no-camera-permission">Could not get permission</Text>
  }
  if (hasPermission === false) {
    return <Text testID="camera-blocked">No access to camera</Text>
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back,
              )
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
})
