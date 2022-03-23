import {
  Box,
  ThemeProvider,
} from "@mui/material";

import { theme } from "./utils/constants";
import AppContextProvider from "./context/AppContext";

// Components
import CharacterList from "./components/CharacterList";

function App() {
  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <Box className="main" sx={{ p:0, position: "relative", maxWidth: "450px", height: "100vh" }}>
          <CharacterList />
        </Box>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
