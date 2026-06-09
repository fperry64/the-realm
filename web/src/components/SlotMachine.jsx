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
  scatterSymbol,
  blazeJackpotSymbol
]

const PAYTABLE = {
  [loreScroll]:      { 3: 2, 4: 5, 5: 10 },
  [sentinelSymbol]:  { 3: 3, 4: 8, 5: 15 },
  [relicSymbol]:     { 3: 4, 4: 10, 5: 20 },
  [forgeSymbol]:     { 3: 5, 4: 15, 5: 35 },
  [dragonSymbol]:    { 3: 7, 4: 25, 5: 60 },
  [kingSymbol]:      { 3: 10, 4: 40, 5: 100 },
  [sigilSymbol]:     { 3: 15, 4: 75, 5: 200 },
  [ghostSlot]:       { 3: 25, 4: 125, 5: 500 },
  [blazeSlot]:       { 3: 50, 4: 250, 5: 1000 }
}

const PAYLINES = [
  [0, 0, 0, 0, 0], // Top
  [1, 1, 1, 1, 1], // Middle
  [2, 2, 2, 2, 2], // Bottom
  [0, 1, 2, 1, 0], // V
  [2, 1, 0, 1, 2]  // Inverted V
]

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

    return totalWin

}

function generateRandomReels() {
  return Array.from({ length: 5 }, () =>
    Array.from(
      { length: 3 },
      () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    )
  )
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
  const [betAmount, setBetAmount] = useState(10)
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

  async function spin() {

    console.log('SPIN BUTTON CLICKED')

    if (spinning) return

    if (betAmount > balance) {
        alert('Not enough Ghost Coins to place that bet.')
        return
    }

    setSpinning(true)

    const newBalance = balance - betAmount
    setBalance(newBalance)

    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (user) {

        const { error } = await supabase
            .from('profiles')
            .update({
                ghost_coins: newBalance
            })
            .eq('id', user.id)

        if (error) {
            console.error('Failed to update Ghost Coins:', error)
        }
    }

    const finalReels = generateRandomReels()

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
        setLastWin(winnings)

        if (winnings > 0) {
            const finalBalance = newBalance + winnings
            setBalance(finalBalance)
        
            const {
                data: { user }
            } = await supabase.auth.getUser()

            if (user) {

                await supabase
                    .from('profiles')
                    .update({
                        ghost_coins: finalBalance
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

      <div className="machine-balance-label">
        Ghost Coin Balance
      </div>

      <div className="machine-balance-value">
        {balance.toLocaleString()} Ghost Coins
      </div>

      <div className="machine-jackpot-label">
        <p>🔥 BLAZE'S JACKPOT 🔥</p>
      </div>

      <div className="machine-jackpot-value">
        {jackpot.toLocaleString()} Ghost Coins
      </div>  

      <div className="reel-window">

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

        <div className="last-win">
            LAST WIN: {lastWin.toLocaleString()} GC
        </div>

        <div className="bet-section">

        <div className="bet-label">
            BET AMOUNT
        </div>

        <div className="bet-value">
            {betAmount.toLocaleString()} GC
        </div>

        <div className="bet-controls">


            <button
                className="min-button"
                onClick={() =>
                    setBetAmount(10)
                }
            >
                MIN
            </button>

            <button
                onClick={() =>
                    setBetAmount(prev => Math.max(10, prev - 100))
                }
            >
                -100
            </button>

            <button
                onClick={() =>
                    setBetAmount(prev => Math.max(10, prev - 10))
                }
            >
                -10
            </button>        
            

            <button
                onClick={() =>
                    setBetAmount(prev => Math.min(1000000, prev + 10))
                }
            >
                +10
            </button>

            <button
                onClick={() =>
                    setBetAmount(prev => Math.min(1000000, prev + 100))
                }
            >
                +100
            </button>

            <button
                className="max-button"
                onClick={() =>
                    setBetAmount(1000000)
                }
            >
                MAX
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