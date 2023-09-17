"use client"

import { useEffect, useState } from "react"
import Confetti from "react-confetti"

import storage from "@/lib/storage"
import {
  Cell,
  checkValidity,
  initializeInvalidCells,
  isValidInput,
} from "@/lib/sudoku"
import { convertToMatrix, getCellIdx } from "@/lib/matrix"
import NumPad from "./numpad"

const FLATTENED_SIZE = 81

const Game = ({ id, initialState }: { id: string; initialState: string }) => {
  const [game, setGame] = useState<Cell[]>([])
  const [selectedCell, setSelectedCell] = useState(-1)
  const [isComplete, setIsComplete] = useState(false)
  console.log(selectedCell, game)

  const handleSelectChange = (cellIdx: number) => {
    setSelectedCell(cellIdx)
  }

  const handleAdd = (cellIdx: number, value: number) => {
    if (!isValidInput(cellIdx, value)) return

    const newGame = [...game]
    const newCell = { ...newGame[cellIdx] }
    newCell.value = value.toString()
    newGame[cellIdx] = newCell

    let numsFilled = 0
    const invalidCells = initializeInvalidCells(newGame)
    console.log("invalidCells", invalidCells)
    for (let i = 0; i < FLATTENED_SIZE; i++) {
      const newCell = { ...newGame[i] }
      if (newCell.value !== ".") {
        numsFilled++
      }

      newCell.isInvalid = false
      if (invalidCells.has(i)) {
        newCell.isInvalid = true
      }
      newGame[i] = newCell
    }

    if (numsFilled === FLATTENED_SIZE && invalidCells.size === 0) {
      setIsComplete(true)
    }

    setGame(newGame)
  }

  // run everytime the game changes
  useEffect(() => {
    if (id === "" || initialState === "") return
    console.log("initializing game", id, initialState)
    setSelectedCell(-1)
    const existingGame = storage.get(id)
    if (existingGame) {
      setGame(JSON.parse(existingGame))
    } else {
      const newGame: Cell[] = new Array(FLATTENED_SIZE).fill(0)
      for (let i = 0; i < FLATTENED_SIZE; i++) {
        newGame[i] = {
          value: initialState[i],
          isEditable: initialState[i] === ".",
          isInvalid: false,
        }
      }

      const invalidCells = initializeInvalidCells(newGame)
      if (Array.from(invalidCells).length > 0) {
        invalidCells.forEach((cellIdx) => {
          const newCell = { ...newGame[cellIdx] }
          newCell.isInvalid = true
          newGame[cellIdx] = newCell
        })
      }
      console.log("invalidCells", invalidCells)

      storage.set(id, JSON.stringify(newGame))
      setGame(newGame)
    }
  }, [id, initialState])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const isNumericKey = event.key >= "1" && event.key <= "9"

      if (isNumericKey) {
        handleAdd(selectedCell, parseInt(event.key, 10))
      }
    }

    document.addEventListener("keydown", handleKeyPress)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [selectedCell])

  useEffect(() => {
    if (game.length === 0) return

    storage.set(id, JSON.stringify(game))
  }, [game, id])

  return (
    <div>
      <Board
        game={game}
        selectedCell={selectedCell}
        handleSelectChange={handleSelectChange}
      />
      <NumPad handleClick={(value: number) => handleAdd(selectedCell, value)} />
      {isComplete && <Confetti />}
    </div>
  )
}

export default Game

const Board = ({
  game,
  selectedCell,
  handleSelectChange,
}: {
  game: Cell[]
  selectedCell: number
  handleSelectChange: (cellIdx: number) => void
}) => {
  return (
    <table className="relative w-25vw h-25vw table-fixed">
      <colgroup className="border-2 border-black">
        <col span={3} className="border border-solid border-black" />
        <col span={3} className="border border-solid border-black" />
        <col span={3} className="border border-solid border-black" />
      </colgroup>
      <tbody>
        {convertToMatrix(game).map((row: Cell[], rowIdx) => (
          <tr
            key={rowIdx}
            className={`${
              rowIdx % 3 === 2
                ? "border-b-2 border-black"
                : "border-b border-black"
            }`}
          >
            {row.map((cell: Cell, colIdx) => {
              const cellIdx = getCellIdx(rowIdx, colIdx)
              return (
                <Cell
                  key={cellIdx}
                  // \u00A0 is a hack to prevent empty rows from collapsing
                  value={cell.value === "." ? "\u00A0" : cell.value}
                  idx={cellIdx}
                  isFocused={selectedCell === cellIdx}
                  onFocusChange={handleSelectChange}
                  isEditable={cell.isEditable}
                  isInvalid={cell.isInvalid}
                />
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Cell = ({
  idx,
  value,
  isEditable,
  isFocused,
  onFocusChange,
  isInvalid,
}: {
  idx: number
  value: string
  isEditable: boolean
  isFocused: boolean
  onFocusChange: (cellIdx: number) => void
  isInvalid: boolean
}) => {
  return (
    <td
      className={`${idx % 3 === 2 ? "border-r-2 border-black " : ""} ${
        isEditable ? "cursor-pointer" : "bg-gray-200"
      } ${isFocused ? "bg-blue-200" : ""}`}
    >
      <div
        className={`flex justify-center relative`}
        onClick={() => {
          if (!isEditable) return
          onFocusChange(idx)
        }}
      >
        {value}
        {isInvalid && (
          <div className="w-[5px] h-[5px] bottom-[0px] right-[1px] absolute rounded-full bg-red-500" />
        )}
      </div>
    </td>
  )
}
