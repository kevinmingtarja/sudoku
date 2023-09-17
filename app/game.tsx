"use client"

import { useCallback, useEffect, useState } from "react"

import SudokuGame from "@/components/sudoku"
import storage from "@/lib/storage"
import PuzzlesPicker from "@/components/puzzles-picker"

const GameContainer = ({ puzzles }: { puzzles: Game[] }) => {
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string>("")
  const handleChangePuzzle = useCallback(
    (id: string) => {
      storage.set("lastPuzzleId", id)
      storage.remove(selectedPuzzleId)
      setSelectedPuzzleId(id)
    },
    [selectedPuzzleId]
  )

  useEffect(() => {
    const lastPuzzleId = storage.get("lastPuzzleId")
    if (lastPuzzleId) {
      setSelectedPuzzleId(lastPuzzleId)
    } else {
      handleChangePuzzle(puzzles[0].id)
    }
  }, [handleChangePuzzle, puzzles])

  const selectedPuzzle = puzzles.filter(
    (puzzle) => puzzle.id === selectedPuzzleId
  )

  return (
    <div className="flex flex-col align-baseline w-full">
      <SudokuGame
        id={selectedPuzzleId}
        initialState={
          selectedPuzzle.length == 1 ? selectedPuzzle[0].puzzle : ""
        }
      />
      <PuzzlesPicker
        puzzles={puzzles}
        selectedPuzzle={selectedPuzzleId}
        setSelectedPuzzle={handleChangePuzzle}
      />
    </div>
  )
}

export default GameContainer
