import React, {useContext,useState} from 'react';

import { StyleSheet, ScrollView } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { AlignLeft, Plus, Heart, MessageCircle,ThumbsUp,Notebook,LogOut  } from 'lucide-react-native';
import { Camera } from 'lucide-react-native';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { appContext } from '@/context/context';
import { useNavigation } from '@react-navigation/native';

import CameraHistories from './CameraHistories';

import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';


const Home = () => {

  const {  LogoutUser } = useContext(appContext)
  const navigation = useNavigation()

  const handleLogout = async () =>  {
    const status = await LogoutUser()
     if(status === 200) {
      navigation.navigate("Login")
     }
  }

  return (
    <>
      <HStack style={styles.container}>

      {/* <CameraHistories/> */}
        <Box style={styles.header} className="h-20 w-20">
          <AlignLeft color="#3560a0" size={30} />
          <Avatar size="md" >
            <AvatarFallbackText>Jane Doe</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
              }}
            />
            <AvatarBadge />
          </Avatar>
        </Box>
      </HStack>
      <Box style={styles.heading}>
        <Heading size='4xl'>Feed</Heading>
      </Box>
      <Box>
        <Box style={{marginHorizontal: 190}}>
           <LogOut color="red" size={40} onPress={()=> handleLogout()} />

        </Box>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Box style={styles.historiesContainer}>
            <Avatar size="xl">
              <AvatarFallbackText>Jane Doe</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                }}
              />
              <AvatarBadge size='2xl' style={styles.badge}>
                <Plus color="white" size={20} />
              </AvatarBadge>
            </Avatar>
          </Box>
        </ScrollView>
      </Box>

      <Box style={styles.containerPublication}>
        <Box style={styles.userContainer}>
          <Avatar size="md">
            <AvatarFallbackText>Jane Doe</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
              }}
            />
          </Avatar>
          <VStack>
            <Heading size="sm">Ronald Richards</Heading>
            <Text size="sm">@Nursing Assistant</Text>
          </VStack>
        </Box>
      </Box>
      <ScrollView>
        <Card style={styles.publication} className="rounded-lg">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1529693662653-9d480530a697?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            className="h-[240px] w-full rounded-xl"
            alt='props'
            width={298}
            height={190}
          />
          <Box style={styles.iconContainer}>
            <Box style={styles.iconBox}>
              <Heart color="red" size={20} />
              <MessageCircle color="gold" size={20} />
            </Box>
            <Box style={styles.iconBox}>
             <Text>153 Likes</Text>
            </Box>
          </Box>
        </Card>
      </ScrollView>
    </>
  )
}


const styles = StyleSheet.create({
  header: {
    width: "100%",
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  heading: {
    paddingHorizontal: 20
  },

  badge: {
    padding: 2,
    backgroundColor: "#0973a8"
  },

  historiesContainer: {
    marginVertical: 20,
    paddingHorizontal: 30,
    display: "flex",
    flexDirection: "row",
    gap: 30,
  },

  userContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10
  },

  containerPublication: {
    paddingHorizontal: 20,
    marginTop: 10
  },

  publication: {
    marginHorizontal: 20,
    marginVertical: 0,
    borderRadius: 10,
    overflow: "hidden",
    width: 330,
    backgroundColor: "transparent"
  },

  iconContainer: {
   display: "flex",
   flexDirection: "row",
   justifyContent: "space-between"
  },

  iconBox: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    gap: 10,
    alignItems: "center"
  }



});

export default Home