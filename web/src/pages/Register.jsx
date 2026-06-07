import { useState } from 'react'
import { supabase } from '../supabase'
import './Register.css'
import gateImage from '../assets/gate.png'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://the-blitz-realm.vercel.app/choose-destiny',
        data: {
          username: username
        }
      }
    })

    if (error) {
      alert(error.message)
      return
    }

    setMessage(
      'THE GATE RECOGNIZES YOU\n\nA message has been delivered to your email\n\nVerify your account to continue your journey.')
    }

  return (
    <div>
      <img
        src={gateImage}
        alt="The Realm Gate"
        className="register-hero"
      />

      <h1 className="register-title">
        THE REALM REMEMBERS
      </h1>

      <label className="register-label">
        Choose Your Wanderer Name
      </label>

      <input
        placeholder="Enter a unique name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <br />

      <label className="register-label">
        Enter Your Email Address
      </label>

      <input
        placeholder="Enter Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <label className="register-label">
        Enter Your Desired Password
      </label>

      <input
        type="password"
        placeholder="Create a Strong Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      {message && (
        <div className="success-message">
          {message}
        </div>
    )}

      <button onClick={handleRegister}>
        Enter The Realm
      </button>
    </div>
  )
}

export default Register