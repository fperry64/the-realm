import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import ChooseDestiny from './pages/ChooseDestiny'
import CharacterSheet from './pages/CharacterSheet'
import Casino from './pages/Casino'
import HallOfForgottenLore from './pages/HallOfForgottenLore'


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
      </Routes>
    </BrowserRouter>
  )
}

export default App