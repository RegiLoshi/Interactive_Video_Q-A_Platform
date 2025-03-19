import './App.css'
import useUserStore from './stores/userStore';
import {React} from "react";
import AuthLayout from "./components/auth pages/AuthLayout"
import LogIn  from './components/auth pages/LogIn';
import { Routes, Route } from "react-router-dom";
function App() {

  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LogIn />} />
        <Route path="signup" element={<h1>Test signup</h1>} />
      </Route>
    </Routes>
  )
}

export default App

