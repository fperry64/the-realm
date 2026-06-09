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
        
        <section className="casino-quote-card">
          <p>
            “The house always wins… unless I decide the story needs a twist.”
          </p>
          <span>- Blaze Mortem</span>
        </section>

        <SlotMachine
            jackpot={jackpot}
            ghostCoins={profile.ghost_coins}
        />

      </div>
    </div>
  )
}

export default Casino