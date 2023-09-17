"use client"

import { RefObject, useCallback, useEffect, useRef, useState } from "react"

import SudokuGame from "@/components/sudoku"
import ListItem from "@/components/list-item"
import storage from "@/lib/storage"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react"

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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [toPick, setToPick] = useState<string>("")

  const handleSelect = (id: string) => {
    setToPick(id)
    onOpen()
  }

  const handleConfirmation = () => {
    setSelectedPuzzle(toPick)
    setToPick("")
    onClose()
  }

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100">
        {puzzles.map((puzzle, idx) => (
          <ListItem
            key={puzzle.id}
            onClick={() => handleSelect(puzzle.id)}
            text={`Puzzle ${idx + 1}`}
            isSelected={puzzle.id === selectedPuzzle}
          />
        ))}
      </ul>
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        handleConfirmation={handleConfirmation}
      />
    </>
  )
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  handleConfirmation,
}: {
  isOpen: boolean
  onClose: () => void
  handleConfirmation: () => void
}) => {
  const cancelRef = useRef() as RefObject<HTMLButtonElement>
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Start New Game
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? Current progress will be lost.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirmation} ml={3}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
