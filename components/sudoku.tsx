"use client"

import { RefObject, useEffect, useRef, useState } from "react"
import Confetti from "react-confetti"

import storage from "@/lib/storage"
import { checkInvalidCells, isValidInput } from "@/lib/sudoku"
import { convertToMatrix, getCellIdx } from "@/lib/matrix"
import NumPad from "./numpad"
import useTimer from "@/hooks/useTimer"
import Timer from "./timer"
import { Button } from "@chakra-ui/react"
import Dialog from "./dialog"
import { secondsToTime } from "@/lib/time"
import { usePageVisibility } from "@/hooks/usePageVisibility"
import { EMPTY_CELL, FLATTENED_SIZE } from "@/lib/constants"

const Game = ({
  id,
  initialState,
  handleStartNewGame,
}: {
  id: string
  initialState: string
  handleStartNewGame: (id: string) => void
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [game, setGame] = useState<Cell[]>([])
  const { time, setTime, isPaused, setIsPaused, reset: resetTimer } = useTimer()
  const [selectedCell, setSelectedCell] = useState(-1)
  const [isComplete, setIsComplete] = useState(false)
  const isVisible = usePageVisibility()

  const handleSelectChange = (cellIdx: number) => {
    setSelectedCell(cellIdx)
  }

  const handleAdd = (cellIdx: number, value: string) => {
    if (isPaused || !isValidInput(cellIdx, value)) return

    const newGame = [...game]
    const newCell = { ...newGame[cellIdx] }
    newCell.value = value
    newGame[cellIdx] = newCell

    let numsFilled = 0
    const invalidCells = checkInvalidCells(newGame)

    for (let i = 0; i < FLATTENED_SIZE; i++) {
      const newCell = { ...newGame[i] }
      if (newCell.value !== EMPTY_CELL) {
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
      setIsPaused(true)
    }

    setGame(newGame)
  }

  const handleDelete = (cellIdx: number) => {
    handleAdd(cellIdx, EMPTY_CELL)
  }

  const handleArrowMovement = (
    key: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown"
  ) => {
    let curr = selectedCell

    do {
      if (curr < 0 || curr > 80) return
      switch (key) {
        case "ArrowLeft":
          curr--
          break
        case "ArrowUp":
          curr = curr - 9
          break
        case "ArrowRight":
          curr++
          break
        case "ArrowDown":
          curr = curr + 9
          break
      }
    } while (curr >= 0 && curr <= 80 && !game[curr].isEditable)
    if (curr >= 0 && curr <= 80) handleSelectChange(curr)
  }

  useEffect(() => {
    setSize({ height: document.body.scrollHeight, width: window.innerWidth })
  }, [])

  // initialization, runs everytime a new game is selected
  useEffect(() => {
    if (id === "" || initialState === "") return

    setSelectedCell(-1)
    const existingGame = storage.get(id)
    if (existingGame) {
      setGame(JSON.parse(existingGame))
      const lastTime = storage.get("time")
      setTime(lastTime ? parseInt(lastTime, 10) : 0)
    } else {
      const newGame: Cell[] = new Array(FLATTENED_SIZE).fill(0)
      for (let i = 0; i < FLATTENED_SIZE; i++) {
        newGame[i] = {
          value: initialState[i],
          isEditable: initialState[i] === EMPTY_CELL,
          isInvalid: false,
        }
      }

      const invalidCells = checkInvalidCells(newGame)
      if (Array.from(invalidCells).length > 0) {
        invalidCells.forEach((cellIdx) => {
          const newCell = { ...newGame[cellIdx] }
          newCell.isInvalid = true
          newGame[cellIdx] = newCell
        })
      }

      storage.set(id, JSON.stringify(newGame))
      setGame(newGame)
      resetTimer()
      setIsPaused(false)
      setIsComplete(false)
    }
  }, [id, initialState])

  // handles key presses
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key >= "1" && event.key <= "9") {
        handleAdd(selectedCell, event.key)
      } else if (event.key === "Backspace") {
        handleDelete(selectedCell)
      } else if (event.key === "Escape") {
        setSelectedCell(-1)
      } else if (event.key === " ") {
        event.preventDefault()
        setIsPaused((curr) => !curr)
      } else if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        if (selectedCell === -1) return
        event.preventDefault()
        handleArrowMovement(event.key)
      }
    }

    document.addEventListener("keydown", handleKeyPress)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [selectedCell])

  // handles saving to storage
  useEffect(() => {
    if (game.length === 0) return

    storage.set(id, JSON.stringify(game))
  }, [game, id])

  useEffect(() => {
    if (time === 0) return
    storage.set("time", time.toString())
  }, [time])

  useEffect(() => {
    if (!isVisible) setIsPaused(true)
  }, [isVisible])

  return (
    <div className="flex gap-4 mb-16 flex-col lg:gap-8">
      <Timer
        className="w-full justify-center"
        time={time}
        isPaused={isPaused}
        handlePause={() => setIsPaused((paused) => !paused)}
      />
      <div className="flex flex-col gap-8 md:gap-4 lg:gap-6 lg:flex-row">
        <Board
          game={game}
          selectedCell={selectedCell}
          handleSelectChange={handleSelectChange}
          isPaused={isPaused}
          isComplete={isComplete}
        />
        <NumPad
          handleClick={(value: number) =>
            handleAdd(selectedCell, value.toString())
          }
          handleDelete={() => handleDelete(selectedCell)}
        />
        {isComplete && <Confetti height={size.height} width={size.width} />}
        {
          <CompletionDialog
            time={time}
            handleConfirm={() => {
              handleStartNewGame(id)
            }}
            isOpen={isComplete}
            onClose={() => handleStartNewGame(id)}
          />
        }
      </div>
    </div>
  )
}

export default Game

const Board = ({
  game,
  selectedCell,
  handleSelectChange,
  isPaused,
  isComplete,
}: {
  game: Cell[]
  selectedCell: number
  handleSelectChange: (cellIdx: number) => void
  isPaused: boolean
  isComplete: boolean
}) => {
  return (
    <table className="relative w-full h-[90vw] table-fixed lg:w-[40vw] lg:h-[40vw]">
      <colgroup className="border-4 border-black">
        <col span={3} className="border-2 border-gray-500" />
        <col span={3} className="border-2 border-gray-500" />
        <col span={3} className="border-2 border-gray-500" />
      </colgroup>
      <tbody>
        {convertToMatrix(game).map((row: Cell[], rowIdx) => (
          <tr
            key={rowIdx}
            className={`${
              rowIdx % 3 === 2
                ? "border-b-4 border-black"
                : "border-b-2 border-gray-500"
            }`}
          >
            {row.map((cell: Cell, colIdx) => {
              const cellIdx = getCellIdx(rowIdx, colIdx)
              return (
                <Cell
                  key={cellIdx}
                  // \u00A0 is a hack to prevent empty rows from collapsing
                  value={
                    (isPaused && !isComplete) || cell.value === EMPTY_CELL
                      ? "\u00A0"
                      : cell.value
                  }
                  idx={cellIdx}
                  isSelected={selectedCell === cellIdx}
                  handleSelect={handleSelectChange}
                  isEditable={isPaused ? false : cell.isEditable}
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
  isSelected,
  handleSelect,
  isInvalid,
}: {
  idx: number
  value: string
  isEditable: boolean
  isSelected: boolean
  handleSelect: (cellIdx: number) => void
  isInvalid: boolean
}) => {
  return (
    <td
      className={`${idx % 3 === 2 ? "border-r-4 border-black" : ""} ${
        isEditable ? "cursor-pointer" : "bg-gray-200"
      } ${isSelected ? "bg-blue-200" : ""}`}
    >
      <div
        className="flex h-full justify-center items-center relative"
        onClick={() => {
          if (!isEditable) return
          handleSelect(idx)
        }}
      >
        <p className="text-2xl font-bold text-gray-900 select-none md:text-3xl lg:text-4xl">
          {value}
        </p>
        <div
          className={`w-[5px] h-[5px] bottom-[2px] right-[2px] absolute rounded-full bg-red-500 transition-all duration-250 delay-100 ease-in scale-100 ${
            isInvalid ? "scale3d-100" : "scale3d-0"
          } lg:w-[10px] lg:h-[10px] lg:bottom-[5px] lg:right-[5px]`}
        />
      </div>
    </td>
  )
}

const CompletionDialog = ({
  time,
  isOpen,
  onClose,
  handleConfirm,
}: {
  time: number
  isOpen: boolean
  onClose: () => void
  handleConfirm: () => void
}) => {
  const cancelRef = useRef() as RefObject<HTMLButtonElement>
  return (
    <Dialog
      header="Congratulations 🎉"
      body={`You completed the game in ${secondsToTime(time)}.`}
      confirm={
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleConfirm}
          ml={3}
        >
          Start a new game
        </Button>
      }
      isOpen={isOpen}
      handleCancel={onClose}
      cancelRef={cancelRef}
    />
  )
}
