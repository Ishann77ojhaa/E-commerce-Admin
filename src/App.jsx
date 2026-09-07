import { RouterProvider } from "react-router-dom";
import router from "./routes";
import {io} from "socket.io-client";

export const socket = io("https://iecomifybackend.onrender.com",{
  auth:{
    token : localStorage.getItem("token")
  }
});

function App() {

  return <RouterProvider router={router} />;
}

export default App
