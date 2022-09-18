import EventListener from "@kaspernj/api-maker/src/event-listener"
import PropTypes from "prop-types"
import React from "react"

export default class FontSizeElement extends React.PureComponent {
  static propTypes = {
    trix: PropTypes.object.isRequired
  }

  debugging = false
  defaultValue = 16
  currentValue = this.defaultValue
  fontSizeInputRef = React.createRef()
  frozen = false

  render() {
    return (
      <div>
        <EventListener event="trix-selection-change" onCalled={this.onSelectionChanged} target={this.props.trix.editorController.editorElement} />
        <button
          onClick={this.onFontSizeDecrease}
          style={{
            borderWidth: "1px",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: "3px",
            borderTopLeftRadius: "3px"
          }}
        >
          <i className="fa fa-fw fa-minus" />
        </button>
        <input
          defaultValue={this.defaultValue}
          max="9999"
          min="1"
          onBlur={this.onInputBlur}
          onFocus={this.onInputFocus}
          onMouseUp={this.onInputMouseUp}
          onKeyDown={this.onInputKeyDown}
          onKeyUp={this.onInputKeyUp}
          ref={this.fontSizeInputRef}
          style={{
            borderLeft: 0,
            borderRight: 0,
            borderRadius: 0,
            borderWidth: "1px",
            textAlign: "center",
            width: "50px"
          }}
          type="number"
        />
        <button
          onClick={this.onFontSizeIncrease}
          style={{
            borderWidth: "1px",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0
          }}
        >
          <i className="fa fa-fw fa-plus" />
        </button>
      </div>
    )
  }

  applyCurrentValue = () => {
    this.props.trix.editor.activateAttribute("fontSize", `${this.currentValue}px`)
  }

  debug(...args) {
    if (this.debugging) {
      console.log(...args)
    }
  }

  markSelection = () => {
    this.props.trix.editor.activateAttribute("frozen")
    this.fontSizeInputRef.current.focus()
    this.props.trix.blur()
  }

  onInputBlur = (_e) => {
    const isFrozen = this.props.trix.editor.attributeIsActive("frozen")

    this.debug("onInputBlur", {isFrozen})

    if (isFrozen) {
      this.props.trix.editor.deactivateAttribute("frozen")
    }
  }

  onInputFocus = (_e) => {
    this.markSelection()
  }

  onInputMouseUp = (_e) => {
    this.applyFontSizeFromInput()
  }

  onInputKeyDown = (e) => {
    this.debug("onInputKeyDown")

    if (e.key == "Enter") {
      e.preventDefault()
      this.applyFontSizeFromInput()
    }
  }

  onInputKeyUp = (e) => {
    this.debug("onInputKeyUp")

    if (e.key == "Enter") {
      e.preventDefault()
      this.applyFontSizeFromInput()
    }
  }

  applyFontSizeFromInput = () => {
    const fontSizeValue = parseInt(this.fontSizeInputRef.current.value)

    this.debug("applyFontSizeFromInput", {fontSizeValue, currentValue: this.currentValue})

    if (fontSizeValue != this.currentValue) {
      this.currentValue = fontSizeValue
      this.applyCurrentValue()
    }

    this.fontSizeInputRef.current.focus()
  }

  onFontSizeDecrease = (e) => {
    e.preventDefault()

    this.debug("onFontSizeDecrease")

    this.currentValue -= 1
    this.fontSizeInputRef.current.value = this.currentValue
    this.applyCurrentValue()
  }

  onFontSizeIncrease = (e) => {
    e.preventDefault()

    this.debug("onFontSizeIncrease")

    this.currentValue += 1
    this.fontSizeInputRef.current.value = this.currentValue
    this.applyCurrentValue()
  }

  onSelectionChanged = (_e) => {
    this.debug("onSelectionChanged")

    this.syncFontSizeFromCurrentCursor()
  }

  pieceAtCursor() {
    const position = this.props.trix.editor.getPosition()

    return this.props.trix.editorController.composition.document.getPieceAtPosition(position)
  }

  syncFontSizeFromCurrentCursor = () => {
    const pieceAtCursor = this.pieceAtCursor()
    const fontSize = pieceAtCursor.getAttribute("fontSize")

    this.debug("syncFontSizeFromCurrentCursor", {fontSize})

    if (fontSize) {
      const newCurrentValue = parseInt(fontSize)

      this.currentValue = newCurrentValue
      this.fontSizeInputRef.current.value = newCurrentValue
    } else {
      this.currentValue = this.defaultValue
      this.fontSizeInputRef.current.value = this.defaultValue
    }
  }
}
