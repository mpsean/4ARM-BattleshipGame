import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './components/home.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'

//this app is define path

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/login' element={<Login />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App;