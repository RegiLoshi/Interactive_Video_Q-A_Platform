import './App.css'
import useUserStore from './stores/userStore';
import {React} from "react";
import AuthLayout from "./components/auth pages/AuthLayout"
import LogIn  from './components/auth pages/LogIn';
import { Routes, Route } from "react-router-dom";
import SignUp from './components/auth pages/SignUp';
import PasswordResetPage from './components/auth pages/PasswordResetPage';
import RequestNewPassword from './components/auth pages/RequestNewPassword'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Dashboard from './components/dashboard/Dashboard'
import ExplorePage from './components/dashboard/ExplorePage'
import AskAQuestionPage from './components/userPages/AskAQuestionPage';
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
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard/>} />
        <Route path='explore' element={<ExplorePage/>} />
      </Route>
      <Route path="/user/:id" element={<DashboardLayout />}>
       {/* <Route index element={<UserProfile/>} /> */}
       {/* <Route path='videos' element={<UserVideos/>} /> */}
      <Route path='askQuestion' element={<AskAQuestionPage/>} />
      </Route>
    </Routes>
  )
}

export default App

