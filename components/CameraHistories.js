import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useContext, useEffect } from 'react';
import { appContext } from '@/context/context';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwitchCamera, Circle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import { decode, encode } from 'base-64';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';
import * as ImageManipulator from 'expo-image-manipulator';

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

export default function CameraHistories() {
  const  { setUpdateDom, uploadPictureUser,getHistories} = useContext(appContext)
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState("")

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitas dar permiso a la cámara</Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
     const id  = await createNode()
    
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({ quality: 0.5 }); // Toma la foto

        const resizedUri = await resizeImage(photo.uri, 800, 600); // Redimensiona la imagen

        // Si quieres leer la imagen como base64
        const base64 = await FileSystem.readAsStringAsync(resizedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });


        if(photo) {
          await uploadPictureUser(base64,id); // Llama a la función para subir la imagen
          setPhoto(photo)
        }

      } catch (error) {
        console.error('Error tomando la foto:', error);
      }
    }
  };

  const resizeImage = async (uri, newWidth, newHeight, format = ImageManipulator.SaveFormat.JPEG, quality = 0.8) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { compress: quality, format: format }
      );
      return result.uri; // La nueva URI de la imagen redimensionada
    } catch (error) {
      console.error('Error al redimensionar la imagen:', error);
      throw error; // Propagar el error
    }
  };
 

  const createNode = async () => {
    const currentToken = await AsyncStorage.getItem("@TOKEN");
    const options = {
      method: 'POST',
      url: 'https://elalfaylaomega.com/congregacionelroble/jsonapi/node/histories_usuarios',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        Authorization: 'Basic YWRtaW46cm9vdA==',
        'X-XSRF-Token': currentToken,
      },
      data: {
        "data": {
          "type": "node--histories_usuarios",
          "attributes": {
            "title": "Nueva historia",
            "field_historia_texto_usuario": "Contenido de la historia",
          },
        },
      },
    };

    try {
      const response = await axios.request(options);
      return response.data.data.id; // Retorna el ID del nodo creado
    } catch (error) {
      handleAxiosError(error);
    }
  };


  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={ref => setCameraRef(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <SwitchCamera color="gold" size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Circle color="white" size={60} />
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
});
