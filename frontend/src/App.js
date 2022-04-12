import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserHistory } from "history";
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import LandingPage from "./Pages/LandingPage";


const theme= createTheme({
  palette:{
    primary:{
      main: "#FFA700"
    },
    secondary:{
      main: "#101820"
    }
  }
})

const browserHistory = createBrowserHistory();

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <BrowserRouter browserHistory = {browserHistory}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register /> } />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
