import './App.css'
import React from "react";
import AuthLayout from "./components/auth pages/AuthLayout"
import LogIn  from './components/auth pages/LogIn';
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from './components/auth pages/SignUp';
import PasswordResetPage from './components/auth pages/PasswordResetPage';
import RequestNewPassword from './components/auth pages/RequestNewPassword'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Dashboard from './components/dashboard/Dashboard'
import SettingsPage from './components/userPages/SettingsPage';
import ProtectedRoute from './components/auth pages/ProtectedRoute';
import useUserStore from './stores/userStore';
import AuthCheck from './components/auth pages/AuthCheck';
import SurveyRespondents from './components/surveys/SurveyRespondents';
import CreateSurveyPage from './components/userPages/CreateSurveyPage';
import SurveyResponse from './components/surveys/SurveyResponse'
import AnswerSurvey from './components/surveys/AnswerSurvey';
function App() {
  const token = useUserStore((state) => state.token);

  return (
    <>
      <AuthCheck />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/login" replace />} />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LogIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="passwordReset" element={<PasswordResetPage />} /> 
          <Route path="requestNewPassword" element={<RequestNewPassword />} />
        </Route>

        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard/>} />
            <Route path="create-survey" element={<CreateSurveyPage />} />
            <Route path="surveys/:surveyId" element={<SurveyRespondents />} />
            <Route path="surveys/:surveyId/:userId" element={<SurveyResponse />} />
            <Route path="surveys/:surveyId/answer" element={<AnswerSurvey />} />
          </Route>
        </Route>
        
        <Route path="/user/:id" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path='settings' element={<SettingsPage/>} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App

