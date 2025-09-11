import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/Homepage'
import Forum from './Pages/Forum'
import Services from './pages/Services'
import Chatbox from './pages/Chatbox'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path = "/" element = {<HomePage/>}/>
        <Route path = "/forum" element = {<Forum/>}/>
        <Route path = "/service" element = {<Services/>}/>
        <Route path = "/chatbox" element = {<Chatbox/>}/>
      </Routes>


    </div>
  )
}

export default App