import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StyleSheet, Text, View } from 'react-native';
import Stacks from './stacks/stacks';


export default function App() {
  return (
    <GluestackUIProvider mode="light">
        <Stacks/>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
