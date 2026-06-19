import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

import '../Wanderers.css'

import wanderersBanner from '../assets/wanderers_banner.png'

function Wanderers() {

    const [wanderers, setWanderers] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {

        loadWanderers()

    }, [])

    async function getSentinelRank(
        userId
    ) {

        const {
            data: battleData
        } = await supabase
            .from(
                'sentinel_battles'
            )
            .select('result')
            .eq(
                'user_id',
                userId
            )

        const victories =

            battleData?.filter(
                battle =>
                    battle.result ===
                    'Victory'
            ).length || 0

        const {
            data: ranksData
        } = await supabase
            .from(
                'sentinel_ranks'
            )
            .select('*')
            .order(
                'victories_required',
                {
                    ascending: true
                }
            )

        let currentRank =
            'Initiate Sentinel'

        if (
            ranksData &&
            ranksData.length > 0
        ) {

            let rank =
                ranksData[0]

            ranksData.forEach(
                r => {

                    if (
                        victories >=
                        r.victories_required
                    ) {

                        rank = r

                    }

                }
            )

            currentRank =
                rank.rank_name

        }

        return currentRank

    }

    function getCrownTitle(
        profile,
        totalRelicValue
    ) {

        const renown =
            profile.renown || 0

        const ghostCoins =
            profile.ghost_coins || 0

        let title =
            'Wanderer'

        if (
            renown >= 5000 &&
            ghostCoins >= 1000000
        ) {
            title =
                'Keeper of the Coin'
        }

        if (
            renown >= 7500 &&
            ghostCoins >= 1500000
        ) {
            title =
                'Master of the Treasury'
        }

        if (
            renown >= 10000 &&
            ghostCoins >= 2000000 &&
            totalRelicValue >= 10000
        ) {
            title =
                'Guardian of the Forge'
        }

        if (
            renown >= 25000 &&
            ghostCoins >= 3500000 &&
            totalRelicValue >= 15000
        ) {
            title =
                'Warden of the Golden Vault'
        }

        if (
            renown >= 50000 &&
            ghostCoins >= 4500000 &&
            totalRelicValue >= 25000
        ) {
            title =
                'Crownbearer of the Realm'
        }

        if (
            renown >= 100000 &&
            ghostCoins >= 5000000 &&
            totalRelicValue >= 35000
        ) {
            title =
                'High Treasurer of the Forgotten Kingdom'
        }

        if (
            renown >= 250000 &&
            ghostCoins >= 10000000 &&
            totalRelicValue >= 50000
        ) {
            title =
                'The Crowned Sovereign'
        }

        return title

    }

    async function loadWanderers() {

        const {
            data: profilesData,
            error
        } = await supabase

            .from('profiles')

            .select('*')

            .order(
                'username',
                {
                    ascending: true
                }
            )

        if (error) {

            console.error(error)

            return

        }

        const wandererData =

            await Promise.all(

                profilesData.map(

                    async profile => {

                        const {
                            data: relicData
                        } = await supabase

                            .from('user_relics')

                            .select(`
                                relics (
                                    card_value
                                )
                            `)

                            .eq(
                                'user_id',
                                profile.id
                            )

                        const totalRelicValue =

                            (relicData || [])
                                .reduce(

                                    (sum, relic) =>

                                        sum +

                                        (
                                            relic.relics
                                                ?.card_value || 0
                                        ),

                                    0

                                )

                        const relicCount =

                            relicData?.length || 0

                        const {
                            data: journalData
                        } = await supabase

                            .from('user_journal')

                            .select(
                                'realm_category'
                            )

                            .eq(
                                'user_id',
                                profile.id
                            )

                        const discoveredCategories =

                            journalData?.map(
                                entry =>
                                    entry.realm_category
                            ) || []

                        const sentinelRank =

                            await getSentinelRank(
                                profile.id
                            )

                        const crownTitle =

                            getCrownTitle(
                                profile,
                                totalRelicValue
                            )

                            let moonRank =
                            'Initiate of the First Moon'

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
                            profile.renown >= 15000

                        const rank4 =
                            rank3 &&
                            hasKeys &&
                            hasCemetery &&
                            profile.renown >= 17500

                        const rank5 =
                            rank4 &&
                            hasSentinels &&
                            hasFirstSentinel &&
                            profile.renown >= 25000

                        const rank6 =
                            rank5 &&
                            hasForge &&
                            hasRealmForge &&
                            relicCount >= 5 &&
                            profile.renown >= 32500

                        const rank7 =
                            rank6 &&
                            hasKings &&
                            hasForgottenKingsChamber &&
                            relicCount >= 7 &&
                            profile.renown >= 75000

                        if (rank2)
                            moonRank =
                                'Moon Observer'

                        if (rank3)
                            moonRank =
                                'Keeper of the Silver Grove'

                        if (rank4)
                            moonRank =
                                'Warden of the Moonstone Circle'

                        if (rank5)
                            moonRank =
                                'Lunar Sage'

                        if (rank6)
                            moonRank =
                                'Elder of the Silver Sky'

                        if (rank7)
                            moonRank =
                                'Archdruid of the Moon'

                        return {

                            ...profile,

                            crownTitle,

                            moonRank,

                            sentinelRank,

                            relicCount,

                            totalRelicValue

                        }

                    }

                )

            )

        setWanderers(
            wandererData
        )

        setLoading(false)

    }

    if (loading) {

        return (

            <div className="wanderers-page">

                Loading Wanderers...

            </div>

        )

    }

    return (

        <div className="wanderers-page">

            <img
                src={wanderersBanner}
                alt="Wanderers"
                className="wanderers-banner"
            />

            <div className="wanderers-content">

                <h1>

                    THE WANDERERS OF THE REALM

                </h1>

                <p className="wanderers-intro">

                    Every legend begins as a wanderer.
                    These are the explorers,
                    sentinels, collectors,
                    druids, and rulers who
                    shape the future of The Realm.

                </p>

                <div className="wanderers-grid">

                    {

                    wanderers.map(
                        wanderer => (

                            <div
                                key={wanderer.id}
                                className="wanderer-card"
                            >

                                <img
                                    src={
                                        wanderer.avatar_url ||

                                        'https://placehold.co/200x200?text=Portrait'
                                    }
                                    alt={
                                        wanderer.username
                                    }
                                    className="wanderer-avatar"
                                />

                                <h3>

                                    {
                                        wanderer.username
                                    }

                                </h3>

                                <p>

                                    <strong>

                                        Title:

                                    </strong>

                                    {' '}

                                    {
                                        wanderer.crownTitle
                                    }

                                </p>

                                <p>

                                    <strong>

                                        Moon Druid Path:

                                    </strong>

                                    {' '}

                                    {
                                        wanderer.moonRank
                                    }

                                </p>

                                <p>

                                    <strong>

                                        Sentinel Rank:

                                    </strong>

                                    {' '}

                                    {
                                        wanderer.sentinelRank
                                    }

                                </p>

                                <p>

                                    <strong>

                                        Destiny:

                                    </strong>

                                    {' '}

                                    {
                                        wanderer.current_destiny
                                    }

                                </p>

                                <p>

                                    <strong>

                                        Renown:

                                    </strong>

                                    {' '}

                                    {
                                        (
                                            wanderer.renown || 0
                                        ).toLocaleString()
                                    }

                                </p>

                            </div>

                        )

                    )

                }

                </div>

            </div>

        </div>

    )

}

export default Wanderers