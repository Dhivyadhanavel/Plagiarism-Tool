import React from 'react'
import logo2 from './images/logo2.png'
import { useNavigate } from 'react-router-dom'
import './Homepage.css'
import { LuFileSearch } from "react-icons/lu";
import { MdMobileFriendly,MdOutlinePrivacyTip,MdOutlineDocumentScanner,MdReport } from "react-icons/md";
import { PiFilesDuotone,PiStudentDuotone } from "react-icons/pi";
import { TiUploadOutline } from "react-icons/ti";
import { GiArchiveResearch } from "react-icons/gi";
import { RiFileEditFill,RiBloggerLine } from "react-icons/ri";
import { IoBusiness } from "react-icons/io5";
const Homepage = () => {
    const navigate=useNavigate()
  return (
    <>
    <img className='nodup-hp' src={logo2} alt="logo"></img>
    <div  className='title-hp'>
        <p><span>Welcome to Nodup.</span> </p>
    </div>
    <div className='collection-hp'>
    <div className='p2-hp'>
        <h3>Ensure Originality, Maintain Integrity</h3>
       <p>Nodup is an advanced plagiarism detection tool designed to help students, researchers, content creators, and professionals ensure their work is original. With cutting-edge AI-powered analysis, we provide accurate, fast, and reliable plagiarism detection.
      </p></div>
      <div className='link-to-signin'>
        <p>Try Nodup now and take the first step toward originality. <span onClick={()=>navigate('/signin')} >Start Checking</span></p>
      </div></div>
      <div className='p3-hp'>
        <h3>Why Choose Nodup?
        </h3>
       <p><ul>

       

<li>Accurate Plagiarism Detection <LuFileSearch className='l1' color='#03045E'/></li>
<li>User-Friendly Interface <MdMobileFriendly  className='l1' color='#03045E' /></li>
<li>Supports Multiple Formats <PiFilesDuotone className='l1' color='#03045E'/></li>
<li>Privacy First <MdOutlinePrivacyTip className='l1' color='#03045E'/></li></ul>

      </p>
    </div>
    <div className='p4-hp'>
        <h3>How It Works

        </h3>
       <p><ol>

       

<li> Upload Your Document <TiUploadOutline className='l2' color='#03045E'/>
</li>
<li>Scan for Plagiarism <MdOutlineDocumentScanner className='l2' color='#03045E'/>
</li>
<li>Get a Detailed Report <MdReport className='l2' color='#03045E'/>
</li>
<li>Improve & Refine <RiFileEditFill className='l2' color='#03045E'/>

</li>
</ol>

      </p>
    </div>
    <div className='p5-hp'>
        <h3>Who Can Benefit from Nodup?


        </h3>
       <p><ul>
      <li> Students & Educators <PiStudentDuotone  className='l2' color='#03045E'/></li>
      <li> Writers & Bloggers <RiBloggerLine className='l2' color='#03045E'/> </li>
      <li> Businesses & Marketers <IoBusiness className='l2' color='#03045E'/></li>
      <li> Researchers & Journalists <GiArchiveResearch className='l2' color='#03045E' /></li>

 
</ul>

      </p>
    </div>
    <br></br><br></br>
    </>
  )
}

export default Homepage