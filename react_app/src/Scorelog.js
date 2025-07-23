import React from 'react'
import { useLocation } from 'react-router-dom'

const Scorelog = () => {
  
  const location=useLocation()
  const data=JSON.parse(location.state.data)
  

  return (
    <section className="scorelog-data">
      <div className="scorelog-data-view">
        <ul>
      <li><span className="data-label">TITLE     :</span> {data.text[0].title}</li>
      <li><span className="data-label">TYPE      :</span> {data.text[0].type}</li>
      <li><span className="data-label">SIMILARITY SCORE      :</span> {data.text[0].score}</li>
      <li><span className="data-label">CONTENT 1 :</span> {data.text[0].text1}</li>
      <li><span className="data-label">CONTENT 2 :</span> {data.text[0].text2}</li>
      <li><span className="data-label">DATE      :</span> {data.text[0].date}</li>
      <li><span className="data-label">TIME      :</span> {data.text[0].time}</li>
      
      </ul>
      </div>
    </section>
  )
}

export default Scorelog