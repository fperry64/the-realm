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

import { useState } from 'react'
    
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

  const [betAmount, setBetAmount] = useState(10)
  const [lastWin, setLastWin] = useState(0)
  const [spinning, setSpinning] = useState(false)

  function spin() {

    if (spinning) return

    setSpinning(true)

    setTimeout(() => {

        setReels(generateRandomReels())

        setSpinning(false)

    }, 1000)

  }

  return (
    <div className="slot-machine">

      <h2>BLAZE MORTEM'S SLOT MACHINE</h2>

      <div className="machine-balance-label">
        Ghost Coin Balance
      </div>

      <div className="machine-balance-value">
        {ghostCoins.toLocaleString()} Ghost Coins
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
                className="reel-column"
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