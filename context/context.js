import { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const appContext = createContext();

const AppProvider = ({ children }) => {

    const [tk, setTk] = useState(null); // Cambia esto según lo que necesites
    const [logoutTk, setLogoutTk] = useState(null)


    const LoginUser = async () => {

        const options = {
            method: 'POST',
            url: 'https://elalfaylaomega.com/congregacionelroble/user/login', // Asegúrate de que este sea el endpoint correcto
            headers: {
                'Content-Type': 'application/json',
            },
            data: { name: "admin", pass: "pass" }
        };

        try {
            const response = await axios.request(options);
            console.log(response.status, "Login exitoso");
            // c
            
            return response.status
        } catch (error) {
            console.log('Error en el login:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'Credenciales inválidas'); // Muestra un mensaje de error
        }
    };
    

    const getToken =async()=>{
        const options = {
            method: 'GET',
            url: `https://elalfaylaomega.com/congregacionelroble/session/token?_format=json`, // Incluye csrf_token en la URL
            headers: {
                'Content-Type': 'application/json',
            },
            data: {}, // Cuerpo vacío
        };
        try {
            const response = await axios.request(options);
           
            console.log(response, "token exitoso");
            await AsyncStorage.setItem("@TOKEN", response.data)
           
            
        } catch (error) {
            console.error('Error en el logout:', error.response ? error.response.data : error.message);
        }
    }

    useEffect(()=>{
      getToken()
    },[])



    const LogoutUser = async () => {
        console.log(logoutTk, "l;ogour")
        const options = {
            method: 'POST',
            url: `https://elalfaylaomega.com/congregacionelroble/user/logout`, // Incluye csrf_token en la URL
            headers: {
                'Content-Type': 'application/json',
            },
            data: {}, // Cuerpo vacío
        };
    
        try {
            const response = await axios.request(options);
            console.log(response.data, "Logout exitoso");
            await AsyncStorage.removeItem("@TOKEN");
            return response.status;
        } catch (error) {
            console.error('Error en el logout:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <appContext.Provider value={{
            LoginUser,
            LogoutUser,
            tk,
            logoutTk

        }}>
            {children}
        </appContext.Provider>
    );
};

export { AppProvider, appContext };
