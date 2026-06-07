import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Register from './pages/Register'
import ChooseDestiny from './pages/ChooseDestiny'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/choose-destiny" element={<ChooseDestiny />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App