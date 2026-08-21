import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, getMe } from "./src/store/authSlice";
import { Outlet } from "react-router-dom";



export default function Layout() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(()=>{ 
    if(token){
      dispatch(getMe())
      dispatch(fetchProfile());  
    }}, [token, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}