import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './landing.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'
import Victory from './components/victory.jsx'
import Defeat from './components/defeat.jsx'
import Game from './components/game.jsx'
import WelcomeScreen from './components/WelcomeScreen.jsx';
import LoginSimple from './components/loginSimple.jsx';
import ResetPage from './components/resetPage.jsx';
import GameAdv from './components/gameAdv.jsx';
import VictoryAdv from './components/victoryAdv.jsx';
import DefeatAdv from './components/defeatAdv.jsx';
import WelcomeScreenAdv from './components/welcomeScreenAdv.jsx';
import Profile from './components/userProfile.jsx';
import Search from './components/profileSearch.jsx';

//this app is define path

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route index element={<Home />}></Route>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/victory' element={<Victory />}></Route>
      <Route path='/defeat' element={<Defeat />}></Route>
      <Route path='/welcomescreen' element={<WelcomeScreen />}></Route>
      <Route path='/game' element={<Game />}></Route>
      <Route path='/loginSimple' element={<LoginSimple />}></Route>
      <Route path='/resetPage' element={<ResetPage />}></Route>
      <Route path='gameAdv' element={<GameAdv />}></Route>
      <Route path='/victoryAdv' element={<VictoryAdv />}></Route>
      <Route path='/defeatAdv' element={<DefeatAdv />}></Route>
      <Route path='/welcomeScreenAdv' element={<WelcomeScreenAdv />}></Route>
      <Route path='/search' element={<Search />}></Route>
      <Route path='/profile' element={<Profile />}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App;