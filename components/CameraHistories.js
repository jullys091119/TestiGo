import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwitchCamera, Camera, Video, Circle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import { decode, encode } from 'base-64'
import axios from 'axios';

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
    await createNode('histories_usuarios');
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        const base64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setHistorie(base64); // Guarda la cadena base64

        // Asegúrate de pasar el tipo correcto
        // console.log(idNode, "Id node"); // Aquí se registra el ID del nodo

        // if (idNode) {
        //   // Solo intenta subir la imagen si el ID es válido
        //   // await uploadPictureUser(base64, idNode); // Llama a la función de subida con el ID
        // } else {
        //   console.error('Node ID is null, cannot upload image.');
        // }
      } catch (error) {

      }
    }
  };

 

  const createNode = async (type) => {
    var options = {
      method: 'POST',
      url: 'https://elalfaylaomega.com/congregacionelroble/node/histories_usuarios?_format=json',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        Authorization: 'Basic YWRtaW46cm9vdA==',
        'X-XSRF-Token': 'SeiYRoQ0s97EoktAJl6yJgHcmsyJEK647gGURU2fzHSCJY7PKXfn2KaxmbSL9tH6'
      },
      data: {
        data: {
          type: 'node--histories_usuarios',
          attributes: {
            title: `Nueva historia`,
            field_historia_texto_usuario:  "nenenenennene" }
        }
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data,  "response . dada");
    }).catch(function (error) {
      if (error.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
        // http.ClientRequest en node.js
        console.log(error.request);
      } else {
        // Algo paso al preparar la petición que lanzo un Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  }



  const uploadPictureUser = async (base64Data) => {
    const url = `https://elalfaylaomega.com/file/upload/node/${nodeId}/histories_usuarios/field_historia_imagen_usuario`;

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
