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
                    <br />
                    Wealth may fill one's treasury, but only renown secures a legacy.

                </p>

            </div>

            <div className="leaderboard-grid">
               
                <div className="leaderboard-card">

                    <h2>
                        Top 5 Renown
                    </h2>

                    <table className="leaderboard-table">

                        <thead>

                            <tr>

                                <th>Rank</th>

                                <th>Username</th>

                                <th>Renown</th>

                            </tr>

                        </thead>

                        <tbody>

                            {renownLeaders.map((user, index) => (

                                <tr key={user.username}>

                                    <td>{index + 1}</td>

                                    <td>{user.username}</td>

                                    <td>
                                        {user.renown?.toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                <div className="leaderboard-card">

                    <h2>
                        Top 5 Treasury
                    </h2>

                    <table className="leaderboard-table">

                        <thead>

                            <tr>

                                <th>Rank</th>

                                <th>Username</th>

                                <th>Treasury</th>

                            </tr>

                        </thead>

                        <tbody>

                            {treasuryLeaders.map((user, index) => (

                                <tr key={user.username}>

                                    <td>{index + 1}</td>

                                    <td>{user.username}</td>

                                    <td>
                                        {user.ghost_coins?.toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            </div>

        </div>

    )

}

export default Leaderboard