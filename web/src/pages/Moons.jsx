import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

import '../MoonDruids.css'
import moonBanner from '../assets/moon-druids-banner.png'

function Moons() {

    useEffect(() => {

        window.scrollTo(
            0,
            0
        )
    }, [])

    const [journalEntries, setJournalEntries] =
        useState([])

    const [profile, setProfile] =
        useState(null)

    const [relicCount, setRelicCount] =
        useState(0)

    useEffect(() => {

        loadMoonData()

    }, [])

    async function loadMoonData() {

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

        const { data: journalData } =
            await supabase
                .from('user_journal')
                .select('*')
                .eq('user_id', user.id)

        setJournalEntries(
            journalData || []
        )

        const { data: relicData } =
            await supabase
                .from('user_relics')
                .select('id')
                .eq('user_id', user.id)

        setRelicCount(
            relicData?.length || 0
        )

    }

    const discoveredCategories =
        journalEntries.map(
            entry =>
                entry.realm_category
        )

    const hasRavens =
        discoveredCategories.includes(
            'Ravens'
        )

    const hasLostScribes =
        discoveredCategories.includes(
            'Scrolls of the Lost Scribes'
        )

    const hasCrowns =
        discoveredCategories.includes(
            'Crowns'
        )

    const hasGoldenAge =
        discoveredCategories.includes(
            'Golden Age'
        )

    const hasKeys =
        discoveredCategories.includes(
            'Keys'
        )

    const hasCemetery =
        discoveredCategories.includes(
            'The Cemetery'
        )

    const hasSentinels =
        discoveredCategories.includes(
            'Sentinels'
        )

    const hasFirstSentinel =
        discoveredCategories.includes(
            'The First Sentinel'
        )

    const hasForge =
        discoveredCategories.includes(
            'The Forge'
        )

    const hasRealmForge =
        discoveredCategories.includes(
            'The Realm Forge'
        )

    const hasKings =
        discoveredCategories.includes(
            'Kings'
        )

    const hasForgottenKingsChamber =
        discoveredCategories.includes(
            'Forgotten Kings Chamber'
        )

    const rank2 =
        hasRavens &&
        hasLostScribes

    const rank3 =
        rank2 &&
        hasCrowns &&
        hasGoldenAge &&
        profile?.renown >= 1000

    const rank4 =
        rank3 &&
        hasKeys &&
        hasCemetery &&
        profile?.renown >= 2000

    const rank5 =
        rank4 &&
        hasSentinels &&
        hasFirstSentinel &&
        profile?.renown >= 2500

    const rank6 =
        rank5 &&
        hasForge &&
        hasRealmForge &&
        relicCount >= 5 &&
        profile?.renown >= 5000

    const rank7 =
        rank6 &&
        hasKings &&
        hasForgottenKingsChamber &&
        relicCount >= 7 &&
        profile?.renown >= 10000

    let currentRank =
        'Initiate of the First Moon'

    let nextRank =
        'Moon Observer'

    if (rank2) {

        currentRank =
            'Moon Observer'

        nextRank =
            'Keeper of the Silver Grove'

    }

    if (rank3) {

        currentRank =
            'Keeper of the Silver Grove'

        nextRank =
            'Warden of the Moonstone Circle'

    }

    if (rank4) {

        currentRank =
            'Warden of the Moonstone Circle'

        nextRank =
            'Lunar Sage'

    }

    if (rank5) {

        currentRank =
            'Lunar Sage'

        nextRank =
            'Elder of the Silver Sky'

    }

    if (rank6) {

        currentRank =
            'Elder of the Silver Sky'

        nextRank =
            'Archdruid of the Moon'

    }

    if (rank7) {

        currentRank = 
            'Archdruid of the Moon'

        nextRank =
            'Maximum Rank Achieved'
    }

if (!profile) {

    return (

        <div className="moon-page">

            Loading Moon Druids...

        </div>

    )

}

    return (

        <div className="moon-page">

            <img
                src={moonBanner}
                alt="Moon Druids"
                className="moon-banner"
            />

            <div className="moon-content">

                <h1>
                    THE MOON DRUIDS
                </h1>

                <p className="moon-intro">

                    Beneath silver skies and hidden among
                    ancient forests dwell the Moon Druids,
                    one of the oldest surviving orders in
                    The Realm.

                </p>

                <p>

                    Long before kings claimed thrones and
                    before great cities rose from stone,
                    the Moon Druids studied the celestial
                    cycles that governed the world. Their
                    wisdom was recorded beneath moonlit
                    groves, hidden from those who sought
                    power without understanding.

                </p>

                <p>

                    The Druids do not serve kingdoms,
                    rulers, or armies. Their loyalty
                    belongs to the balance of The Realm
                    itself. They observe, remember, and
                    protect knowledge that many believe
                    has been lost forever.

                </p>

                <p>

                    Few travelers are ever granted access
                    to their sacred circles. Fewer still
                    leave with the secrets they sought.

                </p>

                <p>

                    The Moon Druids preserve knowledge hidden from the rest of The Realm.
                    Future discoveries associated with the Moon Druids will appear within
                    these archives.

                </p>

                <div className="moon-section">

                    <h2>

                        PATH OF THE MOON DRUIDS

                    </h2>

                    <div className="rank-list">

                        <p>✓ Initiate of the First Moon</p>

                        <p>{rank2 ? '✓' : '🔒'} Moon Observer</p>

                        <p>{rank3 ? '✓' : '🔒'} Keeper of the Silver Grove</p>

                        <p>{rank4 ? '✓' : '🔒'} Warden of the Moonstone Circle</p>

                        <p>{rank5 ? '✓' : '🔒'} Lunar Sage</p>

                        <p>{rank6 ? '✓' : '🔒'} Elder of the Silver Sky</p>

                        <p>{rank7 ? '✓' : '🔒'} Archdruid of the Moon</p>

                    </div>

                </div>

                <div className="moon-section">

                    <h2>

                        CURRENT STANDING

                    </h2>

                    <p>

                        {currentRank}

                    </p>

                    <p>

                        Renown:
                        {' '}
                        {profile.renown.toLocaleString()}

                    </p>

                    <p>

                        Relics:
                        {' '}
                        {relicCount}

                    </p>

                </div>

                <div className="moon-section">

                    <h2>

                        NEXT ADVANCEMENT

                    </h2>

                    <p>

                        {nextRank}

                    </p>

                    <div className="requirements-list">

                        {!rank2 && (

                            <>

                                <p>

                                    {hasRavens ? '✓' : '🔒'}

                                    {' '}

                                    Discover Ravens

                                </p>

                                <p>

                                    {hasLostScribes ? '✓' : '🔒'}

                                    {' '}

                                    Discover Scrolls of the Lost Scribes

                                </p>

                            </>

                        )}

                        {rank2 && !rank3 && (

                            <>

                                <p>

                                    {hasCrowns ? '✓' : '🔒'}

                                    {' '}

                                    Discover Crowns

                                </p>

                                <p>

                                    {hasGoldenAge ? '✓' : '🔒'}

                                    {' '}

                                    Discover Golden Age

                                </p>

                                <p>

                                    {profile?.renown >= 1000
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    1,000 Renown

                                </p>

                            </>

                        )}

                        {rank3 && !rank4 && (

                            <>

                                <p>

                                    {hasKeys ? '✓' : '🔒'}

                                    {' '}

                                    Discover Keys

                                </p>

                                <p>

                                    {hasCemetery ? '✓' : '🔒'}

                                    {' '}

                                    Discover The Cemetery

                                </p>

                                <p>

                                    {profile?.renown >= 2000
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    2,000 Renown

                                </p>

                            </>

                        )}

                        {rank4 && !rank5 && (

                            <>

                                <p>

                                    {hasSentinels ? '✓' : '🔒'}

                                    {' '}

                                    Discover Sentinels

                                </p>

                                <p>

                                    {hasFirstSentinel
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    Discover The First Sentinel

                                </p>

                                <p>

                                    {profile?.renown >= 2500
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    2,500 Renown

                                </p>

                            </>

                        )}

                        {rank5 && !rank6 && (

                            <>

                                <p>

                                    {hasForge ? '✓' : '🔒'}

                                    {' '}

                                    Discover The Forge

                                </p>

                                <p>

                                    {hasRealmForge
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    Discover The Realm Forge

                                </p>

                                <p>

                                    {relicCount >= 5
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    Own 5 Relics

                                </p>

                                <p>

                                    {profile?.renown >= 5000
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    5,000 Renown

                                </p>

                            </>

                        )}

                        {rank6 && !rank7 && (

                            <>

                                <p>

                                    {hasKings ? '✓' : '🔒'}

                                    {' '}

                                    Discover Kings

                                </p>

                                <p>

                                    {hasForgottenKingsChamber
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    Discover Forgotten Kings Chamber

                                </p>

                                <p>

                                    {relicCount >= 7
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    Own 7 Relics

                                </p>

                                <p>

                                    {profile?.renown >= 10000
                                        ? '✓'
                                        : '🔒'}

                                    {' '}

                                    10,000 Renown
                
                                </p>
                            
                            </>
                        
                        )}

                        {rank7 && (

                            <p>

                                ✓ Maximum Rank Achieved

                            </p>

                        )}
                    
                    </div>

                </div>

            </div>

        </div>

    )

}

export default Moons