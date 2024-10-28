import { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { encode } from 'base-64';
import * as ImagePicker from 'expo-image-picker'

const appContext = createContext();

const AppProvider = ({ children }) => {
  const [tk, setTk] = useState(null);
  const [logoutTk, setLogoutTk] = useState(null);
  const [history, setHistory] = useState([]);
  const [updateDom, setUpdateDom] = useState({});
  const [imagePerfil, setImagePerfil] = useState("")
  const [picture, setPicture] = useState("")

  const LoginUser = async () => {
    const options = {
      method: 'POST',
      url: 'https://elalfaylaomega.com/congregacionelroble/user/login',
      params: {format: 'json'},
      headers: {
        cookie: 'SSESSb2836ffed0f029445bc13c66737a631e=Ynr-ETn0WL7q1EhWfdsBtBHDqImC9BLy4tmWnyTh97Fn3V9R',
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/10.1.1'
      },
      data: {name: 'admin', pass: 'pass'}
    };
    
    return axios.request(options).then(function (response) {
      console.log(response.data)
      return response.status
    }).catch(function (error) {
      console.error(error);
    });
  };

  const getToken = async () => {
    try {
      const response = await axios.get('https://elalfaylaomega.com/congregacionelroble/session/token?_format=json', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      await AsyncStorage.setItem("@TOKEN", response.data);
    } catch (error) {
      console.error('Error al obtener el token:', error.response ? error.response.data : error.message);
    }
  };



  const getHistories = async () => {
    try {
      const response = await axios.get('https://elalfaylaomega.com/congregacionelroble/jsonapi/node/histories_usuarios?include=field_historia_imagen_usuario', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const  dataImg = response.data
      const histories = response.data.data.map(element => ({
        id: element.id,
        img: dataImg,
      }));
      setHistory(histories);
      return histories;
    } catch (error) {
      console.error('Error al obtener las historias:', error.response ? error.response.data : error.message);
    }
  };


  const  setStoragePictureImage = (img) => {
    console.log(img, "INg")
    if(img !== undefined) {
      try {
        AsyncStorage.setItem("@PERFIL", img)
      } catch (error) {
        console.log(error, "problemas al ingresar imagen a storagesss")
      }
    }
  }

  const getStoragePictureImage = async () => {
    try {
      const img =  await AsyncStorage.getItem("@PERFIL")
      setPicture(img)
      console.log(img,"obteniendo la imagen para mostrarla")
    } catch (error) {
      console.log(error, "problemas al ingresar imagen a storage")
    }
  }


  const pickImagePerfil = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });
    if (!result.canceled) {
      // Luego, puedes enviar la imageBase64 al servidor en lugar de result.assets[0].uri
      const base64ImageData = result.assets[0].base64
      uploadPictureUserPerfil(base64ImageData);
    }
  };

  const uploadPictureUserPerfil = async (base64Data) => {
    url = 'https://elalfaylaomega.com/credit-customer/file/upload/user/user/user_picture';
    // Convierte la imagen base64 en un ArrayBuffer
    const binaryData = new Uint8Array(atob(base64Data).split('').map(char => char.charCodeAt(0)));
    // Crea un objeto FormData para enviar la imagen como un archivo binario
    const formData = new FormData();
    formData.append('file', {
      uri: 'data:application/octet-stream;base64,' + base64Data,
      type: 'application/octet-stream',
      name: `raton.jpg`
    });

    // Agrega el encabezado "Content-Disposition" con el nombre de archivo
    formData.append('Content-Disposition', 'attachment; filename="33.jpg"');
    // Agrega los encabezados necesarios
    const headers = {
      'Content-Type': 'application/octet-stream', // Cambiado a application/octet-stream
      'X-XSRF-Token': tk,
      'Authorization': 'Basic Og==',
      'Content-Disposition': `file; filename="imagen de perfil.jpg"`
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: binaryData, // Cambiado a binaryData
      });
      const responseData = await response.json();
      setImagePerfil(responseData.uri[0].url)
      setStoragePictureImage(responseData.uri[0].url)
      getStoragePictureImage()
      return 
    } catch (error) {
      console.error(error);
    }
  }

  
  //FUNCION SUBIR FOTO PARA OBTENER EL ID  Y HACER EL PATCH
  const uploadFile = async (base64Data) => {
    const url = 'https://elalfaylaomega.com/congregacionelroble/jsonapi/node/histories_usuarios/field_historia_imagen_usuario';
    // Convierte la imagen base64 en un ArrayBuffer
    const binaryData = new Uint8Array(atob(base64Data).split('').map(char => char.charCodeAt(0)));
    // Crea un objeto FormData para enviar la imagen como un archivo binario
    const formData = new FormData();
    formData.append('file', {
      uri: 'data:application/octet-stream;base64,' + base64Data,
      type: 'application/octet-stream',
      name: `raton.jpg`
    });

    // Agrega el encabezado "Content-Disposition" con el nombre de archivo
    formData.append('Content-Disposition', 'attachment; filename="33.jpg"');
    // Agrega los encabezados necesarios
    const headers = {
      'Content-Type': 'application/octet-stream', // Cambiado a application/octet-stream

      'Authorization': 'Basic Og==',
      'Content-Disposition': `file; filename="nueva historia foto.jpg"`
    };
    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: binaryData, // Cambiado a binaryData
      });
      const elapsedTime = Date.now() - startTime;
      // console.log(`Tiempo de carga: ${elapsedTime} ms`);
      const responseData = await response.json();
       return responseData.data.id
    } catch (error) {
      console.error(error);
    }
  };
  
  //FUNCION ASOCIAR IMAGEN A NODO Y ACTUALIZAR
  const uploadPictureUser = async (base64Data, nodeId) => {
    const tk = await AsyncStorage.getItem("@TOKEN");
    const url = `https://elalfaylaomega.com/congregacionelroble/jsonapi/node/histories_usuarios/${nodeId}`;

    try {
      // Primero, sube el archivo y obtén el ID
      const fileId = await uploadFile(base64Data);

      const body = {
        data: {
          type: 'node--histories_usuarios',
          id: nodeId,
          attributes: {},
          relationships: {
            field_historia_imagen_usuario: {
              data: {
                type: 'file--file',
                id: fileId
              }
            }
          }
        }
      };

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
          'Authorization': `Basic ${tk}`,
          'X-XSRF-Token': tk
        },
        body: JSON.stringify(body)
      });

      const responseData = await response.json();
      // console.log('Nodo actualizado exitosamente:', responseData);
    } catch (error) {
      console.error('Error al actualizar el nodo:', error);
    }
  };


  //FUNCION DESLOGUEO
  const LogoutUser = async () => {
    const options = {
      method: 'POST',
      url: `https://elalfaylaomega.com/congregacionelroble/user/logout`,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data, "Logout exitoso");
      return response.status;
    } catch (error) {
      // console.error('Error en el logout:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    getToken();
    getHistories();
    getStoragePictureImage()
  }, []);

  return (
    <appContext.Provider value={{
      LoginUser,
      LogoutUser,
      setUpdateDom,
      uploadPictureUser,
      getHistories,
      uploadPictureUserPerfil,
      imagePerfil,
      updateDom,
      tk,
      logoutTk,
      history,
      picture,
      pickImagePerfil
    }}>
      {children}
    </appContext.Provider>
  );
};

export { AppProvider, appContext };
