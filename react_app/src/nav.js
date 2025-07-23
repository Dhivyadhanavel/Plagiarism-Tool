import React from 'react'
import logo2 from './images/logo2.png'
import './nav.css'
import { FaRegUser,FaRightToBracket} from "react-icons/fa6";
import { useLocation,useNavigate } from 'react-router-dom';
import {useState} from 'react';

const  Navi = ({setNav}) => {
  const location=useLocation()
  const name=location.state?.name||"guest" 
  const [card,setCard]=useState(false)
  const navigate=useNavigate()
  
  return (
    <><nav>
    
        <img src={logo2} alt="logo"></img>
        <ul>
            <li onClick={()=>setNav("Text")}>TEXT</li>
            <li onClick={()=>setNav("pdf")}>PDF</li>
            <li onClick={()=>setNav("docx")}>DOCX</li>

        </ul>
        <div  className="user">
        <FaRegUser onClick={()=>setCard((prev)=>!prev)} className="user-icon" color="#03045E" />
        </div>
        
        

    </nav>
    {(card===true)?<div className="profile-card">
    <ul>
      <li>{name}</li>
      <li onClick={()=>navigate("/")}>LOGOUT <FaRightToBracket/></li>
      
    </ul>
  </div>:<></>}</>
  )
}

export default Navi