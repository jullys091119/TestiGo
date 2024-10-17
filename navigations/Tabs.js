import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Notebook } from 'lucide-react-native';
import Home from '@/components/Home';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Notebook size={size} color={color} />
            ),
          }}
        />
        {/* Agrega otras pestañas aquí si es necesario */}
      </Tab.Navigator>
      <StatusBar />
    </>
  );
}

export default Tabs;
