import React, {useContext,useState} from 'react';
import axios from 'axios';
import { TouchableOpacity, View, Text, TextInput, Alert } from 'react-native';
import { appContext } from '@/context/context';

const Login = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
   
  const  {LoginUser} = useContext(appContext)
   
  const handleLogin = async () => {
    const status =  await LoginUser()
    console.log(status, "status")
    if(status === 200) {
      navigation.replace("Tabs") 
    }
  }


  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }} 
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }} 
      />
      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: 'blue', padding: 10 }}>
        <Text style={{ color: 'white' }}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
