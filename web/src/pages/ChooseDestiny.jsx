import '../ChooseDestiny.css'

function ChooseDestiny() {
  return (
    <div className="choose-destiny-page">

      <h1>THE GATE RECOGNIZES YOU</h1>

      <p className="destiny-message">
        Before entering The Realm, you must choose the path where your story begins.
      </p>

      <div className="destiny-grid">

        <div className="destiny-card">
          <h2>WEALTH</h2>
          <p>Build your fortune and pursue prosperity.</p>
        </div>

        <div className="destiny-card">
          <h2>RELICS</h2>
          <p>Collect rare artifacts and hidden treasures.</p>
        </div>

        <div className="destiny-card">
          <h2>LORE</h2>
          <p>Uncover forgotten knowledge and ancient secrets.</p>
        </div>

        <div className="destiny-card">
          <h2>LEGACY</h2>
          <p>Earn influence, reputation, and recognition.</p>
        </div>

        <div className="destiny-card">
          <h2>FORTUNE</h2>
          <p>Challenge fate through risk and reward.</p>
        </div>

      </div>

    </div>
  )
}

export default ChooseDestiny