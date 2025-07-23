import React from 'react'
import {Route,Routes} from 'react-router-dom'
import App from './App'
import Signin from './signin'
import Similarity from './similarity'
import Scorelog from './Scorelog'
import Homepage from './Homepage.js'

const Routing = () => {
  return (
    <Routes>
    <Route path='/' element={<Homepage/>}></Route>
    <Route path='/signin' element={<Signin/>}></Route>
    <Route path="/app" element={<App/>}></Route>
    <Route path="/similarity" element={<Similarity/>}></Route>
    <Route path="/scorelog" element={<Scorelog/>}></Route>
    
  </Routes>

  )
}

export default Routing