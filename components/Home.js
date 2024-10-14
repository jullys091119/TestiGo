import React from 'react'
import { StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';

const Home = () => {
    return (
        <HStack>
            <Box class="container">
                <Text>Bieinvenido</Text>
            </Box>
        </HStack>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        height: 300,
        backgroundColor: "red"
    }
});

export default Home