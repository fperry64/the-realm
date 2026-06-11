import './SlotMachine.css'

import ghostSlot from '../assets/ghost_slot.png'
import blazeSlot from '../assets/blaze_slot.png'
import wildSymbol from '../assets/wild.png'
import relicSymbol from '../assets/relic.png'
import kingSymbol from '../assets/forgotten_king.png'
import dragonSymbol from '../assets/dragon.png'
import forgeSymbol from '../assets/forge.png'
import sentinelSymbol from '../assets/sentinel_slot.png'
import loreScroll from '../assets/lore_scroll.png'
import sigilSymbol from '../assets/sigil.png'
import scatterSymbol from '../assets/scatter.png'
import blazeJackpotSymbol from '../assets/blaze_jackpot.png'
import emberRaven from '../assets/ember_raven.png'
import cawSound from '../assets/caw.mp3'

import { useState, useRef } from 'react'
import { supabase } from '../supabase'
    
const SYMBOLS = [
  ghostSlot,
  sentinelSymbol,
  loreScroll,
  relicSymbol,
  forgeSymbol,
  dragonSymbol,
  blazeSlot,
  kingSymbol,
  sigilSymbol,
  wildSymbol,
  scatterSymbol
]

const JACKPOT_ODDS = 10000

const PAYTABLE = {
  [loreScroll]:      { 3: 2, 4: 5, 5: 10 },
  [sentinelSymbol]:  { 3: 3, 4: 8, 5: 15 },
  [relicSymbol]:     { 3: 4, 4: 10, 5: 20 },
  [forgeSymbol]:     { 3: 5, 4: 15, 5: 35 },
  [dragonSymbol]:    { 3: 7, 4: 25, 5: 60 },
  [kingSymbol]:      { 3: 10, 4: 40, 5: 100 },
  [sigilSymbol]:     { 3: 15, 4: 75, 5: 200 },
  [ghostSlot]:       { 3: 25, 4: 100, 5: 250 },
  [blazeSlot]:       { 3: 50, 4: 200, 5: 500 }
}

const PAYLINES = [
  [0, 0, 0, 0, 0], // Top
  [1, 1, 1, 1, 1], // Middle
  [2, 2, 2, 2, 2], // Bottom
  [0, 1, 2, 1, 0], // V
  [2, 1, 0, 1, 2]  // Inverted V
]

const RENOWN_PER_LEVEL = 250000

function calculateWinnings(reels, betAmount) {

    let totalWin = 0

    for (const line of PAYLINES) {

        const symbols = line.map(
            (row, reel) => reels[reel][row]
        )

        const nonWildSymbols = symbols.filter(
            symbol =>
                symbol !== wildSymbol &&
                symbol !== scatterSymbol &&
                symbol !== blazeJackpotSymbol
        )

        let targetSymbol

        if (nonWildSymbols.length > 0) {

            targetSymbol = nonWildSymbols[0]

        } else {

            targetSymbol = blazeSlot

        }

        let matchCount = 0

        for (const symbol of symbols) {

            if (
                symbol === targetSymbol ||
                symbol === wildSymbol
            ) {

                matchCount++

            } else {

                break

            }

        }

        if (
            matchCount >= 3 &&
            PAYTABLE[targetSymbol]
        ) {

            totalWin +=
                betAmount *
                PAYTABLE[targetSymbol][matchCount]

        }
    
    }

    const scatterCount = reels
        .flat()
        .filter(
            symbol => symbol === scatterSymbol
        )
        .length

    if (scatterCount >= 3) {

        if (scatterCount === 3) {
            totalWin += betAmount * 5
        }

        else if (scatterCount === 4) {
            totalWin += betAmount * 10
        }

        else if (scatterCount >= 5) {
            totalWin += betAmount * 25
        }

    }   

    return totalWin

}

function generateRandomReels() {

    const reels = Array.from(
        { length: 5 },
        () =>
            Array.from(
                { length: 3 },
                () =>
                    SYMBOLS[
                        Math.floor(
                            Math.random() * SYMBOLS.length
                        )
                    ]
            )
    )

    if (
        Math.floor(
            Math.random() * JACKPOT_ODDS
        ) === 0
    ) {

        reels[2][1] = blazeJackpotSymbol

    }

    return reels

}

function SlotMachine({
  jackpot,
  ghostCoins
}) {

  const [reels, setReels] = useState([
    [ghostSlot, blazeSlot, wildSymbol],
    [relicSymbol, kingSymbol, dragonSymbol],
    [forgeSymbol, sentinelSymbol, loreScroll],
    [sigilSymbol, scatterSymbol, ghostSlot],
    [blazeJackpotSymbol, relicSymbol, kingSymbol]
  ])
  const [balance, setBalance] = useState(ghostCoins)
  const [betAmount, setBetAmount] = useState(100)
  const [lastWin, setLastWin] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [spinningReels, setSpinningReels] = useState([
    false,
    false,
    false,
    false,
    false
  ])

  const spinningReelsRef = useRef([
    false,
    false,
    false,
    false,
    false
  ])

  const [emberRavenActive, setEmberRavenActive] =
    useState(false)

  const [emberWildCount, setEmberWildCount] =
    useState(0)

  const [emberWildPositions, setEmberWildPositions] =
    useState([])

  async function spin() {

    console.log('SPIN BUTTON CLICKED')

    if (spinning) return

    const ravenTriggered =
        Math.random() < 0.06
    
    let ravenWildPositions = []
    
    if (ravenTriggered) {

        const wildCount =
            Math.floor(Math.random() * 6) + 3

        setEmberWildCount(wildCount)

        while (
            ravenWildPositions.length <
            wildCount
        ) {

            const newPosition = {
                reel:
                    Math.floor(
                        Math.random() * 5
                    ),

                row:
                    Math.floor(
                        Math.random() * 3
                    )
            }

            const alreadyUsed =
                ravenWildPositions.some(
                    position =>
                        position.reel ===
                            newPosition.reel &&
                        position.row ===
                            newPosition.row
                )

            if (!alreadyUsed) {

                ravenWildPositions.push(
                    newPosition
                )

            }

        }

        setEmberWildPositions(
            ravenWildPositions
        )

        setEmberRavenActive(true)

        const ravenSound =
            new Audio(cawSound)

        ravenSound.play()

        setTimeout(() => {

            setEmberRavenActive(false)

        }, 3000)

    }

    if (betAmount > balance) {
        alert('Not enough Ghost Coins to place that bet.')
        return
    }

    setSpinning(true)

    const newBalance = balance - betAmount
    setBalance(newBalance)

    const renown =
        Math.floor(
            newBalance /
            RENOWN_PER_LEVEL
        )

    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (user) {

        const { error } = await supabase
            .from('profiles')
            .update({
                ghost_coins: newBalance,
                renown: renown
            })
            .eq('id', user.id)

        if (error) {
            console.error('Failed to update Ghost Coins:', error)
        }
    }


    const finalReels = generateRandomReels()

    console.log(
        'RAVEN POSITIONS:',
        ravenWildPositions
    )

    if (
        ravenTriggered
    ) {

        ravenWildPositions.forEach(
            position => {

                finalReels[
                    position.reel
                ][
                    position.row
                ] = wildSymbol

            }
        )

    }

    console.log(
        'FINAL REELS:',
        finalReels
    )

    const activeReels = [
        true,
        true,
        true,
        true,
        true
    ]

    setSpinningReels(activeReels)
    spinningReelsRef.current = activeReels

    const spinInterval = setInterval(() => {

        setReels(prev => {
            const newReels = [...prev]
            for (let i = 0; i < 5; i++) {
                if (spinningReelsRef.current[i]) {
                    newReels[i] = generateRandomReels()[i]
                }
            }
            return newReels
        })

    }, 175)

    setTimeout(() => {

        setReels(prev => [
            finalReels[0],
            prev[1],
            prev[2],
            prev[3],
            prev[4]
        ])
        
        setSpinningReels([
            false,
            true,
            true,
            true,
            true
        ])

        spinningReelsRef.current = [
            false,
            true,
            true,
            true,
            true
        ]

    }, 2000)

    setTimeout(() => {

        setReels(prev => [
            finalReels[0],
            finalReels[1],
            prev[2],
            prev[3],
            prev[4]
        ])
        
        setSpinningReels([
            false,
            false,
            true,
            true,
            true
        ])

        spinningReelsRef.current = [
            false,
            false,
            true,
            true,
            true
        ]

    }, 3200)

    setTimeout(() => {

        setReels(prev => [
            finalReels[0],
            finalReels[1],
            finalReels[2],
            prev[3],
            prev[4]
        ])
        
        setSpinningReels([
            false,
            false,
            false,
            true,
            true
        ])

        spinningReelsRef.current = [
            false,
            false,
            false,
            true,
            true
        ]

    }, 4400)

    setTimeout(() => {

        setReels(prev => [
            finalReels[0],
            finalReels[1],
            finalReels[2],
            finalReels[3],
            prev[4]
        ])
        
        setSpinningReels([
            false,
            false,
            false,
            false,
            true
        ])

        spinningReelsRef.current = [
            false,
            false,
            false,
            false,
            true
        ]

    }, 5600)

    setTimeout(async () => {

        setReels(finalReels)

        setSpinningReels([
            false,
            false,
            false,
            false,
            false
        ])

        spinningReelsRef.current = [
            false,
            false,
            false,
            false,
            false
        ]

        const winnings =
            calculateWinnings(finalReels, betAmount)

        let totalWinnings = winnings

        if (
            finalReels[2][1] ===
            blazeJackpotSymbol
        ) {

            totalWinnings += jackpot

        }

        setLastWin(totalWinnings)

        if (totalWinnings > 0) {
            const finalBalance = newBalance + totalWinnings
            setBalance(finalBalance)

            const renown =
                Math.floor(
                    finalBalance /
                    RENOWN_PER_LEVEL
                )
        
            const {
                data: { user }
            } = await supabase.auth.getUser()

            if (user) {

                await supabase
                    .from('profiles')
                    .update({
                        ghost_coins: finalBalance,
                        renown: renown
                    })
                    .eq('id', user.id)
            }
        }

    }, 6800)

    setTimeout(() => {

        clearInterval(spinInterval)        

        setSpinning(false)
    
    }, 8000)

  }

  return (
    <div className="slot-machine">

      <h2>BLAZE MORTEM'S SLOT MACHINE</h2>

      <div className="machine-jackpot-label">
        <p>🔥 BLAZE'S JACKPOT 🔥</p>
      </div>

      <div className="machine-jackpot-value">
        {jackpot.toLocaleString()} Ghost Coins
      </div>  

      {
        emberRavenActive && (
            <div className="ember_raven_banner">
                EMBER RAVEN FEATURE ACTIVATED: {emberWildCount} WILDS ADDED
            </div>
        )
      }

      <div className="reel-window">

        {
            emberRavenActive && (
                <img
                    src={emberRaven}
                    alt="Ember Raven"
                    className="ember-raven"
                />
            )
        }

        {reels.map((reel, reelIndex) => (
            <div
                key={reelIndex}
                className={
                    spinningReels[reelIndex]
                    ? 'slot-reel spinning'
                    : 'slot-reel'
                }
            >
                {reel.map((symbol, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="slot-symbol"
                    >
                        <img
                            src={symbol}
                            alt="Slot Symbol"
                        />
                    </div>
                ))}
            </div>
        ))}

    </div>

        <div className="machine-balance-value">
            GHOST COINS: {balance.toLocaleString()}
        </div>

        <div className="last-win">
            LAST WIN: {lastWin.toLocaleString()} GC
        </div>

        <div className="bet-section">
        
        <div className="bet-value">
            BET AMOUNT: {betAmount.toLocaleString()} GC
        </div>

        <div className="bet-controls">

             <button
                onClick={() =>
                    setBetAmount(prev => Math.max(100, prev - 100000))
                }
            >
                -100000
            </button>  
            
            <button
                onClick={() =>
                    setBetAmount(prev => Math.max(100, prev - 10000))
                }
            >
                -10000
            </button>

            <button
                onClick={() =>
                    setBetAmount(prev => Math.max(100, prev - 1000))
                }
            >
                -1000
            </button>

            <button
                onClick={() =>
                    setBetAmount(prev => Math.max(100, prev - 100))
                }
            >
                -100
            </button> 
            
            <button
                onClick={() =>
                    setBetAmount(prev => Math.min(1000000, prev + 100))
                }
            >
                +100
            </button>


            <button
                onClick={() =>
                    setBetAmount(prev => Math.min(1000000, prev + 1000))
                }
            >
                +1000
            </button>

            <button
                onClick={() =>
                    setBetAmount(prev => Math.min(1000000, prev + 10000))
                }
            >
                +10000
            </button>

            <button
                onClick={() =>
                    setBetAmount(prev => Math.min(1000000, prev + 100000))
                }
            >
                +100000
            </button>
            
        </div>

    </div>

      <button
        className="spin-button"
        disabled={spinning}
        onClick={spin}        
      >
        {spinning ? 'SPINNING...' : 'SPIN'}
      </button>

    </div>
  )
}

export default SlotMachine