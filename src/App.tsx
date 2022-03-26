import {
  Box,
  ThemeProvider,
} from "@mui/material";

import { theme } from "./utils/constants";
import AppContextProvider from "./context/AppContext";

// Components
import CharacterList from "./components/CharacterList";

function App() {
  const sx = { p:0, position: "relative", maxWidth: "450px", height: "100vh", overflow: "scroll" };
  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <Box className="main" sx={sx}>
          <CharacterList />
        </Box>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
