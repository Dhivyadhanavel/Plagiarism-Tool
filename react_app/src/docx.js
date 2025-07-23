import React from 'react'
import { FaRegFilePdf } from "react-icons/fa";
import './Documentcontent.css'
import { useState,useEffect } from 'react';
import axios from 'axios'
import {BeatLoader} from "react-spinners"

const Docx = ({nav}) => {
  let [title,setTitle]=useState('')
  let [file1,setFile1]=useState(null)
  let [file2,setFile2]=useState(null)

  
    const [similarity, setSimilarity] = useState(0)
    let [display, setDisplay] = useState('')
   
    
    const displayBox=document.querySelector('.similarity-score')
    const displayBackGround=document.querySelector('.blur-bg')
    const db=document.getElementById('2blr')
    const ld=document.querySelector('.loading')

    const handleDisplay=()=>{
   
      displayBox.style.display="none"
      displayBackGround.style.display="none"
      window.location.reload()
 
   }
    
    useEffect(() => {
      let displayMessage = ''
      if (similarity <= 20) {
        displayMessage = "Great job! Your content is original. ✅"
      }
      else if (similarity > 20 && similarity <= 40) {
        displayMessage = "Mostly original, but refine a bit! ✍️"
      }
      else if (similarity > 40 && similarity <= 60) {
        displayMessage = "Caution! Some parts need rewording. ⚠️"
      }
      else if (similarity > 60 && similarity <= 80) {
        displayMessage = "High similarity! Rewrite and cite. 🚨"
      }
      else {
        displayMessage = "Plagiarism alert! Major revision needed. ❌"
      }
      setDisplay(displayMessage)
    }, [similarity])

 

  const handleSubmit=(e)=>{
    e.preventDefault()
    if (!file1){
      alert('CHOOSE FILE 1 !')
      return
    }
    else if(!file2){
      alert('CHOOSE FILE 2 !')
      return
    }
    else if(!file1 && !file2){
      alert('CHOOSE FILES !')
      return
    }
    else if(!title){
      alert('ENTER THE TITLE !')
      return

    }
    const formData=new FormData()
    formData.append('text',title)
    formData.append("docx1",file1)
    formData.append("docx2",file2)

   
    
       db.style.display="block"
       ld.style.display="block"

    
    
    axios.post('https://nodup.onrender.com/docx',formData, {headers: { "Content-Type": "multipart/form-data" }, withCredentials:true})
    .then((response)=>{
      
      if (!response.data.success){
        alert(response.data.message)
        db.style.display="none"
        ld.style.display="none"
        return
      }
      setSimilarity(response.data.message) 
        
      console.log(response.data.message)
      
        db.style.display="none"
        ld.style.display="none"
      
      displayBackGround.style.display="block"
      displayBox.style.display="block"
      
      console.log(response.data.message)
     
    
    })
    .catch((err)=>{console.log('ERROR : ',err)
      db.style.display="none"
      ld.style.display="none"})

  }
  
  return (
    (nav==="docx")?
        <form className='text-section'>
          <div className="context-title">
        <label htmlFor='c-title'>ENTER THE CONTEXT TITLE : </label>
        <input className='c-title-input' type='text' id='c-title' autoComplete='off' required value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='TITLE'></input>
       </div>
       
            <div className='text1'>
              <div className='t1'>
              
                <p>DOCUMENT 1</p>
                <p className='text-logo'><FaRegFilePdf className='text-logo'/> <span >UPLOAD DOCX </span></p>
                
                <div
                className='input-text1-pdf'
                ><div class="excel2"
    
                ><label  className='i2' htmlFor='i1'>UPLOAD YOUR DOCX FILE 1</label>
                <div className='pdf1-file-choosen'>{file1?file1.name:'NO FILE CHOOSEN'}</div>
                <input onChange={(event)=>{
                  setFile1(event.target.files[0])
                 

                }} required accept='.docx' id='i1' type='file' placeholder='ENTER FILE 1'/>
                
                
                </div>
                
                </div></div>
                <div className='t2'>
                  <p>DOCUMENT 2</p>
                  <p className='text-logo'><FaRegFilePdf className='text-logo'/> <span>UPLOAD DOCX </span></p>
                <div
                className='input-text2-pdf'
                type="text"
                ><div class="excel1"
    
                ><label  className='i2'  htmlFor='i2'>UPLOAD YOUR DOCX FILE 2</label>
                <div className='pdf1-file-choosen'>{file2?file2.name:'NO FILE CHOOSEN'}</div>
                <input onChange={(event)=>{
                   setFile2(event.target.files[0])
                }} required accept='.docx' id='i2' type='file' placeholder='ENTER FILE 2'/>
                </div>
                
                </div>
                  
                
                </div></div>
    
                <button type='submit' onClick={(e)=>handleSubmit(e)} className='cmp'>COMPARE</button>
                <div className='similarity-score'>
          <div className='similarity-display'>
            <h2>{display}</h2>
            <h3>{similarity} % SIMILAR</h3>
          </div>
        </div>
        <div onClick={handleDisplay} className='blur-bg'>

        </div>
        <div className='loading'>
        <h2>PROCESSING</h2>
        <center><BeatLoader color="#03045E" /></center>
          
        </div>
        <div id='2blr' className='blur-bg'>

        </div>
            
            
        </form>:<div></div>
      )
  
}

export default Docx
