import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import '../Casino.css'
import blazeCasinoBanner from '../assets/blaze-casino-banner.png'
import SlotMachine from '../components/SlotMachine'


function Casino() {
  const [profile, setProfile] = useState(null)
  const [jackpot, setJackpot] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      navigate('/login')
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error(error)
      return
    }

    setProfile(data)

    const {data: jackpotData, error: jackpotError} = await supabase
      .from('jackpots')
      .select('current_value')
      .eq('jackpot_name', "Blaze's Jackpot")
      .single()

    if (jackpotError) {
      console.error(jackpotError)
      } else {
        setJackpot(jackpotData.current_value)
      }

    }

  if (!profile) {
    return (
      <div className="casino-page">
        Loading Blaze Mortem&apos;s Casino...
      </div>
    )
  }

  return (
    <div className="casino-page">
      <div className="casino-container">

        <img
            src={blazeCasinoBanner}
            alt="Blaze Mortem's Casino"
            className="casino-banner"
        />

        <section className="casino-hero">
          <p>
            Welcome, Wanderer.
            Take a seat. Test your luck.
            Fortune favors the reckless.
          </p>
        </section>

        <section className="casino-balance-card">
          <h2>GHOST COINS</h2>
          <div className="casino-balance">
            {profile.ghost_coins} Ghost Coins
          </div>
        </section>

        <section className="casino-quote-card">
          <p>
            “The house always wins… unless I decide the story needs a twist.”
          </p>
          <span>- Blaze Mortem</span>
        </section>

        <SlotMachine jackpot={jackpot} />

      </div>
    </div>
  )
}

export default Casino