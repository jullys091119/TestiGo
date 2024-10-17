import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { NavigationContainer } from '@react-navigation/native'; // Importa NavigationContainer
import StackScreens from "./navigations/Stacks";
import { AppProvider } from "./context/context";
export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <GluestackUIProvider mode="light">
          <StackScreens />
        </GluestackUIProvider>
      </NavigationContainer>
    </AppProvider>
  );
}