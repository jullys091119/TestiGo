import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwitchCamera, Camera, Video, Circle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import { decode, encode } from 'base-64'

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}


export default function CameraHistories() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [historie, setHistorie] = useState("")

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitas dar permiso a la camara</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }


  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      try {
        // Convertir la imagen a base64
        const base64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setHistorie(base64); // Set the base64 string
        await uploadPictureUser(base64); // Pass base64 to the upload function
      } catch (error) {
        console.error('Error al leer el archivo:', error);
      }
    }
  }
  
  const uploadPictureUser = async (base64Data) => {
    const url = 'https://elalfaylaomega.com/file/upload/node/histories_usuarios/field_historia_imagen_usuario';
  
    // Crea un objeto FormData para enviar la imagen como un archivo binario
    const formData = new FormData();
    formData.append('file', {
      uri: `data:image/jpeg;base64,${base64Data}`, // Adjust MIME type if necessary
      type: 'image/jpeg',
      name: `raton.jpg`
    });
  
    // Agrega los encabezados necesarios
    const headers = {
      'Content-Type': 'multipart/form-data', // Use multipart/form-data for FormData
      'Authorization': 'Basic Og==',
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData, // Use formData here
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        return;
      }
  
      const responseData = await response.json();
      console.log(responseData, "RESPUEST");
      // Handle successful response
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={(ref) => setCameraRef(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <SwitchCamera color="gold" size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture} >
            <Circle color="white" size={60} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Video color="red" size={40} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
    width: "100%",

  },

  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: 700,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: "100%",
    paddingVertical: 20,
  },


  button: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
