import React from 'react'
import { useLocation } from 'react-router-dom'

const Similarity = () => {
    const location=useLocation()
    const data=location.state
  return (
    <div className="similarity">

        <h1>SIMILARITY SCORE : {JSON.stringify(data)}</h1>

    </div>
    
  )
}

export default Similarity