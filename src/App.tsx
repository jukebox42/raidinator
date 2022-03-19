import {
  ThemeProvider,
} from "@mui/material";

import { theme } from "./utils/constants";
import { CharacterContextProvider } from "./context/CharacterContext";

// Components
import CharacterList from "./components/CharacterList";

function App() {
  return (
    <CharacterContextProvider>
      <ThemeProvider theme={theme}>
        <CharacterList />
      </ThemeProvider>
    </CharacterContextProvider>
  );
}

export default App;
