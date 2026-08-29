import { RouterProvider } from "react-router-dom";
import router from "./routes";
import {io} from "socket.io-client";

export const socket = io("http://localhost:2000",{
  auth:{
    token : localStorage.getItem("token")
  }
});

function App() {

  return <RouterProvider router={router} />;
}

export default App
