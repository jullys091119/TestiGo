

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/components/Home';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator()

function Stacks() {
  return (
    <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={Home} options={{headerShown:false}}/>
        </Tab.Navigator>
        <StatusBar/>
    </NavigationContainer>
  );
}

export default Stacks