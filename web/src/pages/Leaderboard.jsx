import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

import '../Leaderboard.css'

import leaderboardBanner from '../assets/leaderboard.png'

function Leaderboard() {

    const [renownLeaders, setRenownLeaders] = useState([])

    const [treasuryLeaders, setTreasuryLeaders] = useState([])

    async function loadRenownLeaders() {

        const { data, error } = await supabase

            .from('profiles')

            .select('username, renown')

            .order(
                'renown',
                { ascending: false }
            )

            .limit(5)

        if (error) {

            console.error(error)

            return

        }

        setRenownLeaders(data)

    }

    async function loadTreasuryLeaders() {

        const { data, error } = await supabase

            .from('profiles')

            .select('username, ghost_coins')

            .order(
                'ghost_coins',
                { ascending: false }
            )

            .limit(5)

        if (error) {

            console.error(error)

            return

        }

        setTreasuryLeaders(data)

    }

    useEffect(() => {

        loadRenownLeaders()

        loadTreasuryLeaders()

    }, [])

    return (

        <div className="leaderboard-page">

            <div className="leaderboard-container">

                <img
                    src={leaderboardBanner}
                    alt="Realm Leaderboard"
                    className="leaderboard-banner"
                />

            <div className="leaderboard-welcome">

                <p>

                    The Realm's greatest champions are recorded here for all eternity.
                    Wealth may fill one's treasury, but only renown secures a legacy.

                </p>

            </div>

            <div className="leaderboard-grid">

                <div className="leaderboard-card">

                    <h2>
                        TOP 5 RENOWN
                    </h2>

                </div>

                <div className="leaderboard-card">

                    <h2>
                        TOP 5 TREASURY
                    </h2>

                </div>

            </div>


            </div>

        </div>

    )

}

export default Leaderboard