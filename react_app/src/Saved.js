import React from 'react'
import './Saved.css'
import { IoSave } from "react-icons/io5";
import { FaArrowLeft,FaArrowRight,FaTrash } from "react-icons/fa";
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Saved = ( {titledata}) => {
    let [dir,setdir]=useState(null)
    const textcontent=document.querySelector('.text-section')
    console.log(titledata)
    const navigate=useNavigate()
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 540);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 540);
        };
        if (isLargeScreen){
          setdir(true)

        }else{
          setdir(false)
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
   

    const handleroute=(title)=>{
      axios.post('https://nodup.onrender.com/scorelog',{'title':title},{withCredentials:true})
      .then((response)=>{
        console.log(response.data.message)
        
        navigate('/scorelog',{state:{data:JSON.stringify(response.data.message,null,2)}})
        }
        
      )
      .catch((e)=>console.log(e))}

      const handledelete=(title)=>{
        axios.post('https://nodup.onrender.com/delete',{'title':title},{withCredentials:true})
        .then((response)=>{
          console.log(response.data.message)
          window.location.reload()
          
          }
          
        )
        .catch((e)=>console.log(e))
      
      
    }
  return (
    (dir===true)?<div className="sidebar">

        <div className="saved">
          <div className='saved-heading'>
        <IoSave className='icon-save'/>
        
        <p>SAVED SCORES</p></div>
        <div className='saved-title'>
        <ul>
          {titledata.map((value,key)=>(
          
            
          <li className='allign-saved' key={key}><h3  onClick={()=>handleroute(value.title)}>{value.title}</h3>
          
          <FaTrash  className='trash' onClick={()=>handledelete(value.title)}  />
          </li>
        
        ))
          }
        </ul>
        </div>
        </div>

        <div className='arrowleft'>
        <button className="btn" onClick={()=>{setdir(!dir)}}  >
        {(dir)?<FaArrowLeft className="arrow"/>:<FaArrowRight className="arrow"/>}
        </button>
        </div>

    </div>:<div className='nosidebar'><button className="btn" onClick={()=>{setdir(!dir)}}>
        {(dir)?<FaArrowLeft className="arrow"/>:<FaArrowRight className="arrow"/>}
        </button></div>
  )
}

export default Saved
