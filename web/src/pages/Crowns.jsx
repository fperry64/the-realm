import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

import '../Crowns.css'
import crownsBanner from '../assets/crowns_banner.png'

function Crowns() {

    const [profile, setProfile] =
        useState(null)

    const [relicValue, setRelicValue] =
        useState(0)

    useEffect(() => {

        window.scrollTo(0, 0)

        loadCrownsData()

    }, [])

    async function loadCrownsData() {

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) return

        const { data: profileData } =
            await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

        setProfile(profileData)

        const { data: relicData } =
            await supabase
                .from('user_relics')
                .select(`
                    relics (
                        card_value
                    )
                `)
                .eq('user_id', user.id)

        const totalRelicValue =
            relicData?.reduce(
                (sum, relic) =>
                    sum +
                    (
                        relic.relics?.card_value || 0
                    ),
                0
            ) || 0

        setRelicValue(
            totalRelicValue
        )

    }

    const renown =
        profile?.renown || 0

    const ghostCoins =
        profile?.ghost_coins || 0

    const title1 =
        renown >= 5000 &&
        ghostCoins >= 1000000

    const title2 =
        renown >= 7500 &&
        ghostCoins >= 1500000

    const title3 =
        renown >= 10000 &&
        ghostCoins >= 2000000 &&
        relicValue >= 10000

    const title4 =
        renown >= 25000 &&
        ghostCoins >= 3500000 &&
        relicValue >= 15000

    const title5 =
        renown >= 50000 &&
        ghostCoins >= 4500000 &&
        relicValue >= 25000

    const title6 =
        renown >= 100000 &&
        ghostCoins >= 5000000 &&
        relicValue >= 35000

    const title7 =
        renown >= 250000 &&
        ghostCoins >= 10000000 &&
        relicValue >= 50000

    let currentTitle =
        'Wanderer of The Realm'

    let nextTitle =
        'Keeper of the Coin'

    if (title1) {

        currentTitle =
            'Keeper of the Coin'

        nextTitle =
            'Master of the Treasury'

    }

    if (title2) {

        currentTitle =
            'Master of the Treasury'

        nextTitle =
            'Guardian of the Forge'

    }

    if (title3) {

        currentTitle =
            'Guardian of the Forge'

        nextTitle =
            'Warden of the Golden Vault'

    }

    if (title4) {

        currentTitle =
            'Warden of the Golden Vault'

        nextTitle =
            'Crownbearer of the Realm'

    }

    if (title5) {

        currentTitle =
            'Crownbearer of the Realm'

        nextTitle =
            'High Treasurer of the Forgotten Kingdom'

    }

    if (title6) {

        currentTitle =
            'High Treasurer of the Forgotten Kingdom'

        nextTitle =
            'The Crowned Sovereign'

    }

    if (title7) {

        currentTitle =
            'The Crowned Sovereign'

        nextTitle =
            'Maximum Title Achieved'

    }

    if (!profile) {

        return (

            <div className="crowns-page">

                Loading Crowns...

            </div>

        )

    }

    return (

        <div className="crowns-page">

            <img
                src={crownsBanner}
                alt="Crowns"
                className="crowns-banner"
            />

            <div className="crowns-content">

                <h1>

                    THE CROWNS OF THE REALM

                </h1>

                <p className="crowns-intro">

                    Long before kingdoms fell and
                    dynasties vanished into legend,
                    the Crowns of The Realm stood
                    as symbols of wealth, influence,
                    and power.

                    Some rulers earned their crowns
                    through wisdom. Others claimed
                    them through conquest. In the end,
                    every crown leaves behind a legacy.

                </p>

                <div className="crowns-section">

                    <h2>

                        CURRENT TITLE

                    </h2>

                    <div className="current-title">

                        {currentTitle}

                    </div>

                </div>

                <div className="crowns-section">

                    <h2>

                        ROYAL TREASURY

                    </h2>

                    <div className="treasury-grid">

                        <div>

                            <span>Renown</span>

                            <strong>

                                {renown.toLocaleString()}

                            </strong>

                        </div>

                        <div>

                            <span>Ghost Coins</span>

                            <strong>

                                {ghostCoins.toLocaleString()}

                            </strong>

                        </div>

                        <div>

                            <span>Relic Value</span>

                            <strong>

                                {relicValue.toLocaleString()}

                            </strong>

                        </div>

                    </div>

                </div>

                <div className="crowns-section">

                    <h2>

                        PATH OF THE CROWNS

                    </h2>

                    <div className="title-list">

                        <p>{title1 ? '✓' : '🔒'} Keeper of the Coin</p>

                        <p>{title2 ? '✓' : '🔒'} Master of the Treasury</p>

                        <p>{title3 ? '✓' : '🔒'} Guardian of the Forge</p>

                        <p>{title4 ? '✓' : '🔒'} Warden of the Golden Vault</p>

                        <p>{title5 ? '✓' : '🔒'} Crownbearer of the Realm</p>

                        <p>{title6 ? '✓' : '🔒'} High Treasurer of the Forgotten Kingdom</p>

                        <p>{title7 ? '✓' : '🔒'} The Crowned Sovereign</p>

                    </div>

                </div>

                <div className="crowns-section">

                    <h2>

                        NEXT ASCENSION

                    </h2>

                    <p>

                        {nextTitle}

                    </p>

                </div>

            </div>

        </div>

    )

}

export default Crowns