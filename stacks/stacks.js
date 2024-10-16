

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AlignLeft, Plus, Heart, MessageCircle,ThumbsUp,Notebook } from 'lucide-react-native';
import Home from '@/components/Home';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator()

function Stacks() {
  return (
    <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={Home} 
           options={{
            headerShown:false,
            tabBarIcon: ({ color, size }) => (
              <Notebook name="home-outline" size={size} color="red" />
            ),
          
          }}
          
          />
        </Tab.Navigator>
        <StatusBar/>
    </NavigationContainer>
  );
}

export default Stacks