import './App.css'
import useUserStore from './stores/userStore';
import {React} from "react";
import AuthLayout from "./components/auth pages/AuthLayout"
import LogIn  from './components/auth pages/LogIn';
import { Routes, Route } from "react-router-dom";
import SignUp from './components/auth pages/SignUp';
import PasswordResetPage from './components/auth pages/PasswordResetPage';
import RequestNewPassword from './components/auth pages/RequestNewPassword'
function App() {

  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LogIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="passwordReset" element={<PasswordResetPage />} /> 
        <Route path="requestNewPassword" element={<RequestNewPassword />} />
      </Route>
    </Routes>
  )
}

export default App

