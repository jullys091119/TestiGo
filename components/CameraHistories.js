import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwitchCamera, Camera, Video, Circle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import { decode, encode } from 'base-64';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const idNode = await createNode(); // Captura el ID del nodo creado
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        const base64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await uploadPictureUser(base64, idNode); // Sube la imagen
      } catch (error) {
        console.error('Error tomando la foto:', error);
      }
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
            "field_historia_texto_usuario": "nenenenennene",
          },
        },
      },
    };
  
    try {
      const response = await axios.request(options);
      console.log(response.data.drupal_internal__nid)
      return response.data.drupal_internal__nid; // Retorna el ID del nodo creado
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const uploadPictureUser = async (base64Data, nodeId) => {
    
    const url = `https://elalfaylaomega.com/file/upload/node/${nodeId}/histories_usuarios/field_historia_imagen_usuario`;

    const formData = new FormData();
    formData.append('file', {
      uri: `data:image/jpeg;base64,${base64Data}`,
      type: 'image/jpeg',
      name: `historia_${nodeId}.jpg`, // Cambia el nombre si es necesario
    });

    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Basic YWRtaW46cm9vdA==',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
      } else {
        const responseData = await response.json();
        console.log('Imagen subida:', responseData);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const handleAxiosError = (error) => {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
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
