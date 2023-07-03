import React from 'react';
import wizard from '../../../static/images/elf_wizard_transparent.png';
import './header.css';
import { Button } from '@mui/material';
import { useAuthStore } from '../../store/auth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate()
  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user,
]);
    return  (
  <div className="container gpt3__header section__padding" id="home">
    <div className="gpt3__header-content">
      <h1 className="gradient__text">Fill your RPG character with life ... with ease</h1>
      <p className="text-gray-300">
        Did you ever struggle to write the background story of your newly created character?
        Or wondered how bad-ass exactly he/she might look? Struggle no more!
        <br /><br />With RPGen you can use AI to create an epic origin story and stunning images of your hero with a few mouse clicks in seconds
      </p>
      <br></br>
      <div className="flex space-x-2">
        { !isLoggedIn() && <div className="flex space-x-2"><Button variant="contained" onClick={() => navigate("/login")} >Sign In</Button><Button variant="contained" onClick={() => navigate("/register")}>Register</Button></div> }
        { isLoggedIn() && <Button variant="contained" onClick={() => navigate("/app")} >Launch App</Button> }
      </div>
    </div>

    <div className="gpt3__header-image">
      <img src={wizard} />
    </div>
  </div>
);
    }

export default Header;