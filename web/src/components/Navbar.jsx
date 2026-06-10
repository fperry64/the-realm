import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import './Navbar.css'

function Navbar() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    loadUser()

    const {
        data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
        loadUser()
    })

    return () => {
        subscription.unsubscribe()
    }
  }, [])

  async function loadUser() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
        setUser(null)
        setUsername('')
        return
    }

    setUser(user)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setUsername(data.username)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()

    setUser(null)
    setUsername('')

    navigate('/')
  }

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <Link to="/">Home</Link>
      </div>

      <div className="navbar-right">

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="navbar-user">
              Wanderer: {username}
            </span>

            <Link to="/casino">
              Casino
            </Link>

            <Link to="/character">
              Character
            </Link>

            <Link to="/hall">
              Lore
            </Link>

            <Link to="/messageboard">
              Messages
            </Link>

            <Link to="/leaderboard">
              Leaders
            </Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  )
}

export default Navbar