import React, { useEffect } from 'react'
import Navi from './nav'
import Saved from './Saved.js'
import './App.css'
import Textcontent from './textcontent.js'
import { useState } from 'react'
import Documentcontent from './Documentcontent.js'

import Docx from './docx.js'
import axios from 'axios'




const App = () => {
  let [nav,setNav]=useState("Text")
  let [titledata,setTitleData]=useState([])

  useEffect(()=>{
    axios.get("https://nodup.onrender.com/getData",{withCredentials:true})
    .then((response)=>{
      if (response.data.success){
    
      setTitleData(response.data.message)}
      else{
        console.log('No saved data available')
      }
      
    }
    )
    .catch((e)=>console.log(e))
  },[])

  
  

  return (
        <section className='body'>  
    <Navi setNav={setNav}/>
    <Saved  titledata={titledata} />
    <Textcontent nav={nav}  />
    <Documentcontent nav={nav}/>
    <Docx nav={nav}/>
    </section>
    
  )
}

export default App
