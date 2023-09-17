import { useState, useRef, RefObject } from "react"
import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react"

import ListItem from "./list-item"

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
        handleConfirmation={handleConfirmation}
      />
    </>
  )
}

export default PuzzlesPicker

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
      isCentered
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
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleConfirmation}
              ml={3}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
