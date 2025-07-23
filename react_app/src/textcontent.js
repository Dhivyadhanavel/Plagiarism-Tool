import React, { useState, useEffect } from 'react';
import './textcontent.css';
import { FaRegFileWord } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Textcontent = ({ nav }) => {

  let [message1, setMessage1] = useState('')
  let [message2, setMessage2] = useState('')
  let [title, setTitle] = useState('')
  let navigate = useNavigate()

  const [similarity, setSimilarity] = useState(0)
  let [display, setDisplay] = useState('')
  let [displaycard,setDisplayCard]=useState(false)
  
  const displayBox=document.querySelector('.similarity-score')
  const displayBackGround=document.querySelector('.blur-bg')
  
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
  
  const handleDisplay=()=>{
   
     displayBox.style.display="none"
     displayBackGround.style.display="none"
     window.location.reload()

  }
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/text", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text1: message1, text2: message2, title: title }),
        credentials: "include"
      })

      const data = await response.json()

      if (data.success) {
        console.log(data.similarity)
      if (message1!=='' && message2!=='' && title!=='') {
        displayBackGround.style.display="block"
        displayBox.style.display="block"
        setDisplayCard(true)
        setSimilarity(data.message) }
      else{
        alert('Enter text content!')
      }
      }
      else {
        console.log("Message didn't receive!")
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    (nav === "Text") ?
      <form className="text-section">
        <div className="context-title">
          <label htmlFor='c-title'>ENTER THE CONTEXT TITLE : </label>
          <input
            className='c-title-input'
            type='text'
            id='c-title'
            autoComplete='off'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='TITLE'
          />
        </div>
        <div className='text1'>
          <div className='t1'>
            <p>FILE 1</p>
            <p className='text-logo'><FaRegFileWord className='text-logo' /> <span> TYPE BELOW</span></p>
            <textarea
              value={message1}
              onChange={(e) => setMessage1(e.target.value)}
              className='input-text1'
              type="text"
              required
            />
          </div>
          <div className='t2'>
            <p>FILE 2</p>
            <p className='text-logo'><FaRegFileWord className='text-logo' /> <span> TYPE BELOW</span></p>
            <textarea
              className='input-text2'
              type="text"
              value={message2}
              onChange={(e) => setMessage2(e.target.value)}
              required
            />
          </div>
        </div>

        <button type='submit' className='cmp' onClick={(e)=>sendMessage(e)}>COMPARE</button>
       <div className='similarity-score'>
          <div className='similarity-display'>
            <h2>{display}</h2>
            <h3>{similarity} % SIMILAR</h3>
          </div>
        </div>
        <div onClick={handleDisplay} className='blur-bg'>

        </div>
      </form> : <div></div>
  )
}

export default Textcontent
