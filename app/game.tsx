"use client"

import { useCallback, useEffect, useState } from "react"

import SudokuGame from "@/components/sudoku"
import ListItem from "@/components/list-item"
import storage from "@/lib/storage"

type Game = {
  id: string
  puzzle: string
}

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
    <div>
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

const PuzzlesPicker = ({
  puzzles,
  selectedPuzzle,
  setSelectedPuzzle,
}: {
  puzzles: Game[]
  selectedPuzzle: string
  setSelectedPuzzle: (id: string) => void
}) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {puzzles.map((puzzle, idx) => (
        <ListItem
          key={puzzle.id}
          id={puzzle.id}
          onClick={() => setSelectedPuzzle(puzzle.id)}
          text={`Puzzle ${idx + 1}`}
          isSelected={puzzle.id === selectedPuzzle}
        />
      ))}
    </ul>
  )
}
