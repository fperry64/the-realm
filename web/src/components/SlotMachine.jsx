import './SlotMachine.css'

import ghostSlot from '../assets/ghost_slot.png'
import blazeSlot from '../assets/blaze_slot.png'
import wildSymbol from '../assets/wild.png'
import relicSymbol from '../assets/relic.png'
import kingSymbol from '../assets/forgotten_king.png'

function SlotMachine() {
  return (
    <div className="slot-machine">

      <h2>BLAZE MORTEM'S SLOT MACHINE</h2>

      <div className="slot-reels">

        <div className="slot-symbol">
          <img src={ghostSlot} alt="Ghost" />
        </div>

        <div className="slot-symbol">
          <img src={blazeSlot} alt="Blaze Mortem" />
        </div>

        <div className="slot-symbol">
          <img src={wildSymbol} alt="Inferno Wild" />
        </div>

        <div className="slot-symbol">
          <img src={relicSymbol} alt="Relic" />
        </div>

        <div className="slot-symbol">
          <img src={kingSymbol} alt="Forgotten King" />
        </div>

      </div>

      <div className="bet-section">

        <label>Bet Amount</label>

        <input
          type="number"
          min="10"
          max="1000000"
          defaultValue="10"
        />

      </div>

      <button className="spin-button">
        SPIN
      </button>

    </div>
  )
}

export default SlotMachine