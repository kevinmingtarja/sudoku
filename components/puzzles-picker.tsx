"use client"

import { useState, useRef, RefObject } from "react"
import { useDisclosure, Button } from "@chakra-ui/react"

import ListItem from "./list-item"
import Dialog from "./dialog"

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

  const handleConfirm = () => {
    setSelectedPuzzle(toPick)
    setToPick("")
    onClose()
  }

  return (
    <>
      <h2
        id="select-puzzles"
        className="text-2xl font-bold tracking-tight text-gray-900 mb-2"
      >
        Select Puzzles
      </h2>
      <ul role="list" className="divide-y divide-gray-100">
        {puzzles.map((puzzle, idx) => (
          <ListItem
            key={puzzle.id}
            onClick={() =>
              puzzle.id !== selectedPuzzle && handleSelect(puzzle.id)
            }
            text={`Puzzle ${idx + 1}`}
            isSelected={puzzle.id === selectedPuzzle}
          />
        ))}
      </ul>
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        handleConfirm={handleConfirm}
      />
    </>
  )
}

export default PuzzlesPicker

const ConfirmationDialog = ({
  isOpen,
  onClose,
  handleConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  handleConfirm: () => void
}) => {
  const cancelRef = useRef() as RefObject<HTMLButtonElement>
  return (
    <Dialog
      header="Start New Game"
      body="Are you sure? Current progress will be lost."
      cancel={
        <Button ref={cancelRef} onClick={onClose}>
          Cancel
        </Button>
      }
      confirm={
        <Button
          className="bg-red-500 text-white hover:bg-red-600"
          onClick={handleConfirm}
          ml={3}
        >
          Confirm
        </Button>
      }
      isOpen={isOpen}
      handleCancel={onClose}
      cancelRef={cancelRef}
    />
  )
}
