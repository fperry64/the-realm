import '../ChooseDestiny.css'

function ChooseDestiny() {
  return (
    <div className="choose-destiny-page">
      <h1>THE GATE RECOGNIZES YOU</h1>

      <p>
        Your account has been created.
      </p>

      <p>
        Before entering The Realm, you must choose the path where your story begins.
      </p>

      <div className="destiny-buttons">
        <button>Wealth</button>
        <button>Relics</button>
        <button>Lore</button>
        <button>Legacy</button>
        <button>Fortune</button>
      </div>
    </div>
  )
}

export default ChooseDestiny