import React from 'react'
import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './signin.css'
const Signin = () => {
    let [login,setLogin]=useState(
        {username:"",
        password:""
        }
    )
    let [signup,setSignup]=useState({
        name:"",
        username:"",
        password:""
    })
    let navigate=useNavigate()

    

    let [signin,setSignin]=useState(true)

    let [signInState,setsignInState]=useState(true)

    let [signupS,setSignupS]=useState(null)

    

    const formSubmitSignin=(event)=>{
        event.preventDefault(); 
        axios.post('https://nodup.onrender.com/signin',login,{ withCredentials: true })
        .then(response=>{ 
            if (response.data.success===true){
                setsignInState(true)
                
                navigate("/App",{state:{name:response.data.message}})}
            else{
                setsignInState(false)
            }
        })
        .then(()=>setLogin({username:"",
            password:""
            }))
        
        .catch((e)=>console.log(e))
    }

    const formSubmitSignup=(event)=>{
        event.preventDefault()
        axios.post("https://nodup.onrender.com/signup",signup,{ withCredentials: true })
        .then((response)=>
            {
            if (response.data.message==='blank space'){
                alert('invalid')
                return
        
            }
            if(response.data.success){
            setSignupS(true)}
            else{
                setSignupS(false)
            }
        }
        )
        .then(()=>setSignup({name:"",username:"",
            password:""
            }))

            
        .catch((e)=>console.log(e))
    }
  return (
    (signin===true)?<fieldset className="signin-fieldset">
        <legend className='signin-legend'>Signin</legend>
        <form  className="signin-form" onSubmit={formSubmitSignin}>
            
            <div className='username'>
            <label className='form-label' htmlFor='username'>USERNAME : </label>
            <input required autoComplete='off' placeholder="username" className="signin-input" type="text" id="username" value={login.username} onChange={(e)=>setLogin({...login,username:e.target.value})} ></input>
            </div>
            <div className='password'>
            <label className='form-label' htmlFor='pass'>PASSWORD : </label>
            <input required  autoComplete='off' placeholder="password" className="signin-input" type="password" id="pass" value={login.password} onChange={(e)=>setLogin({...login,password:e.target.value})} ></input>
            </div>
            
            <button className="signin-submit" type='submit'>sign-in</button>
            <div className='new-user-signup'>
            
                <p>NEW USER? <span onClick={()=>{setSignin(prev => !prev); setsignInState(true)}} >SIGN UP</span></p>
            </div>
            {(signInState===false)?<p>USERNAME OR PASSWORD IS INCORRECT</p>:<p></p>}
            

        </form>
    </fieldset>
    :<fieldset className="signin-fieldset">
    <legend className='signin-legend'>Signup</legend>
    <form  className="signin-form" onSubmit={formSubmitSignup}>
           <div className='name'>
            <label className='form-label-name' htmlFor='username'>NAME    : </label>
            <input required  autoComplete='off' placeholder="name" className="signin-input" type="text" id="username" value={signup.name} onChange={(e)=>setSignup({...signup,name:e.target.value})} ></input>
            </div>
        <div className='username'>
        <label className='form-label-us' htmlFor='username'>USERNAME : </label>
        <input required  autoComplete='off' placeholder="username" className="signin-input" type="text" id="username" value={signup.username} onChange={(e)=>setSignup({...signup,username:e.target.value})} ></input>
        </div>
        <div className='password'>
        <label className='form-label-pass' htmlFor='pass'>PASSWORD : </label>
        <input required  autoComplete='off' placeholder="password" className="signin-input" type="password" id="pass" value={signup.password} onChange={(e)=>setSignup({...signup,password:e.target.value})} ></input>
        </div>
        
        <button className="signin-submit" type='submit'>sign-up</button>
        <div className='new-user-signup'>
            <p><span onClick={()=>{setSignin(prev => !prev); setSignupS(null)}} >SIGN IN</span></p>
        </div>
        {(signupS===true )?<p>SUCCESSFULLY SIGNED UP!</p>: (signupS===false ) ? <p>USERNAME EXISTS!</p> : <p></p>}
        

    </form>
</fieldset>
  )
}

export default Signin
