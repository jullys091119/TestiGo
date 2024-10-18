import React, { useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '@/components/Login';
import Tabs from './Tabs'; // Asegúrate de que sea la ruta correcta
import { appContext } from '@/context/context';
const Stack = createNativeStackNavigator();

function StackScreens() {
  
  const [tk, setTk] = useState(null)

  
  const getToken = async () => {
    try {
      const currentToken = await AsyncStorage.getItem("@TOKEN")
      if (currentToken) {
        setTk(currentToken)
        console.log(currentToken, "current TOken")
      }

    } catch (error) {
      console.log(error, "Problemas al tomar el token actual")
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  return (
    <Stack.Navigator>
    {
      !tk?(
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        </>
      ): (
        <>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </>
      )
    }
  </Stack.Navigator>
  );
}

export default StackScreens;