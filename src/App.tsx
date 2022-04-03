import {
  Box,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { styled } from "@mui/system";

import { theme } from "utils/constants";
import AppContextProvider from "context/AppContext";

// Components
import CharacterList from "components/CharacterList";
import bg from "./assets/bg.jpg";

const MainBox = styled(Box, {
  name: "MainBox",
  slot: "Wrapper"
})(({ theme }) => ({
  p: 0,
  position: "relative",
  maxWidth: "450px",
  height: "100vh",
  overflowY: "auto",
  overflowX: "hidden",
  backgroundColor: theme.palette.primary.main,
  backgroundImage: `url("${bg}")`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "380%",
  backgroundPosition: "50% 54px",
  backgroundAttachment: "fixed",
}));

const App = () => {
  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainBox>
          <CharacterList />
        </MainBox>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
