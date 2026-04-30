import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
// import Dashboard from './pages/dashboard'
import Inbox from './pages/inbox'
import Results from './pages/results'
// import Settings from './pages/Settings'
import ScanningScreen from './pages/ScanningScreen'
import Profile from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/results" element={<Results />} />
        <Route path="/scanning" element={<ScanningScreen />} />
        <Route path="/profile"   element={<Profile />} />
        
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </BrowserRouter>
  )
}
