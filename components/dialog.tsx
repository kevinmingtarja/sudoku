import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react"
import { RefObject, ReactElement } from "react"

// TO-DO: Find a better way to abstract out this component
// right now, it has different levels of abstraction between
// the text and the buttons, and we're passing the handleCancel
// two times in the caller as an indirect result.
const Dialog = ({
  header,
  body,
  cancelRef,
  cancel = <></>,
  confirm = <></>,
  isOpen,
  handleCancel,
}: {
  header: string
  body: string
  cancelRef: RefObject<HTMLButtonElement>
  cancel?: ReactElement
  confirm?: ReactElement
  isOpen: boolean
  handleCancel: () => void
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleCancel}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {header}
          </AlertDialogHeader>

          <AlertDialogBody>{body}</AlertDialogBody>

          <AlertDialogFooter>
            {cancel}
            {confirm}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default Dialog
