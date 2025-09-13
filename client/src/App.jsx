import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
