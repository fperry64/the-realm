import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import ChooseDestiny from './pages/ChooseDestiny'
import CharacterSheet from './pages/CharacterSheet'
import Casino from './pages/Casino'
import HallOfForgottenLore from './pages/HallOfForgottenLore'
import RealmMessageBoard from './pages/RealmMessageBoard'
import Leaderboard from './pages/Leaderboard'
import Moons from './pages/Moons'
import Crowns from './pages/Crowns'
import Sentinels from './pages/Sentinels'
import Wanderers from './pages/Wanderers'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/choose-destiny" element={<ChooseDestiny />} />
        <Route path="/character" element={<CharacterSheet />} />
        <Route path="/casino" element={<Casino />} />
        <Route path="/hall" element={<HallOfForgottenLore />} />
        <Route path="/messageboard" element={<RealmMessageBoard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/realm/moons" element={<Moons />} />
        <Route path="/realm/crowns" element={<Crowns />} />
        <Route path="/realm/sentinels" element={<Sentinels />} />
        <Route path="/realm/wanderers" element={<Wanderers />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App