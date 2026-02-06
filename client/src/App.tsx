import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/Homepage'
import Forum from './Pages/Forum'
import Services from './Pages/Services'
import Chatbox from './Pages/Chatbox'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import AddEsp32 from './Pages/AddEsp32'
import { Toaster } from 'sonner'

const App: React.FC = () => {
  return (
    <div>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/service" element={<Services />} />
        <Route path="/chatbox" element={<Chatbox />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices" element={<AddEsp32 />} />
      </Routes>
    </div>
  )
}

export default App