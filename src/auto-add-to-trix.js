import addToTrix from "./add-to-trix"

document.addEventListener(
  "trix-initialize",
  (e) => {
    const trix = e.target

    addToTrix(trix)
  }
)
