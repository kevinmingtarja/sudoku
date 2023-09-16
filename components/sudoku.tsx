"use client"

import { useEffect, useRef, useState } from "react"

import storage from "@/lib/storage"
import { Cell, initializeInvalidCells } from "@/lib/sudoku"
import {
  FlattenedMatrix,
  convertToMatrix,
  getCellIdx,
  getColIdx,
  getRowIdx,
  getSubgridIdx,
} from "@/lib/matrix"
import NumPad from "./numpad"

const FLATTENED_SIZE = 81

const Game = ({ id, initialState }: { id: string; initialState: string }) => {
  const [game, setGame] = useState<Cell[]>([])
  const [selectedCell, setSelectedCell] = useState(-1)
  const [isValid, setIsValid] = useState<boolean>(true)

  const [rowsMap, setRowsMap] = useState<FlattenedMatrix<number>>()
  const [colsMap, setColsMap] = useState<FlattenedMatrix<number>>()
  const [subgridsMap, setSubgridsMap] = useState<FlattenedMatrix<number>>()

  const handleSelectChange = (cellIdx: number) => {
    setSelectedCell(cellIdx)
  }

  const checkValidity = (cellIdx: number, value: number) => {
    if (rowsMap && colsMap && subgridsMap) {
      const row = getRowIdx(cellIdx)
      const col = getColIdx(cellIdx)
      const subgrid = getSubgridIdx(cellIdx)

      const mapIdx = value - 1
      const isRowValid = rowsMap.get(row, mapIdx) === 0
      const isColValid = colsMap.get(col, mapIdx) === 0
      const isSubgridValid = subgridsMap.get(subgrid, mapIdx) === 0

      return isRowValid && isColValid && isSubgridValid
    }
    return false
  }

  const handleAdd = (cellIdx: number, value: number) => {
    if (!isValid || cellIdx < 0 || cellIdx > 80 || value < 1 || value > 9)
      return

    const newGame = [...game]
    const newCell = { ...newGame[cellIdx] }
    if (!checkValidity(cellIdx, value)) {
      setIsValid(false)
      newCell.isInvalid = true
      // TO-DO: mark all cells that are affected by this change as invalid
    } else {
      setIsValid(true)
      newCell.isInvalid = false
      // TO-DO: mark all cells that are affected by this change as valid
    }

    newCell.value = value.toString()
    newGame[cellIdx] = newCell
    setGame(newGame)
  }

  useEffect(() => {
    if (id === "" || initialState === "") return

    const existingGame = storage.get(id)
    if (existingGame) {
      setGame(JSON.parse(existingGame))
    } else {
      const newGame: Cell[] = new Array(FLATTENED_SIZE).fill(0)
      for (let i = 0; i < FLATTENED_SIZE; i++) {
        newGame[i] = {
          value: initialState[i],
          isEditable: initialState[i] === ".",
          isInvalid: false, // assume all initial values are valid
        }
      }
      storage.set(id, JSON.stringify(newGame))
      setGame(newGame)
    }
  }, [id, initialState])

  // so that this useEffect only runs once
  const firedRef = useRef(false)
  useEffect(() => {
    if (firedRef.current || game.length === 0) return

    firedRef.current = true
    const { invalidCells, rowsMap, colsMap, subgridsMap } =
      initializeInvalidCells(game)

    if (Array.from(invalidCells).length > 0) {
      setIsValid(false)
    }

    console.log(invalidCells, rowsMap, colsMap, subgridsMap)
    setRowsMap(rowsMap)
    setColsMap(colsMap)
    setSubgridsMap(subgridsMap)
  }, [game])

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
  }, [])

  return (
    <div>
      <Board
        game={game}
        selectedCell={selectedCell}
        handleSelectChange={handleSelectChange}
      />
      <NumPad handleClick={(value: number) => handleAdd(selectedCell, value)} />
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
      } ${isFocused ? "bg-blue-200" : ""} ${isInvalid ? "bg-red-200" : ""}`}
    >
      <div
        className={`flex justify-center`}
        onClick={() => {
          if (!isEditable) return
          onFocusChange(idx)
        }}
      >
        {value}
      </div>
    </td>
  )
}
