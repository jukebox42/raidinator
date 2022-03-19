import {
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
        <CharacterList />
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
