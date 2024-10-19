import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './landing.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'

//this app is define path

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route index element={<Home />}></Route>
      <Route path='/user/register' element={<Register />}></Route>
      <Route path='/user/login' element={<Login />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App;