import scrollToId from "@/lib/scroll"
import { Button } from "@chakra-ui/react"

const NumPad = ({
  handleClick,
  handleDelete,
}: {
  handleClick: (value: number) => void
  handleDelete: () => void
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 h-fit gap-3 mb-2">
        {Array.from({ length: 9 }, (_, idx) => (
          <Button
            key={idx}
            className="bg-gray-200 w-20 h-20 hover:bg-gray-300"
            onClick={() => handleClick(idx + 1)}
          >
            <p className="text-3xl font-bold text-gray-900">{idx + 1}</p>
          </Button>
        ))}
      </div>
      <Button
        className="bg-gray-200 w-full h-16 hover:bg-gray-300"
        onClick={handleDelete}
      >
        <p className="text-3xl font-bold text-gray-900">X</p>
      </Button>

      <p
        className="text-xl font-bold text-gray-900 mt-28 cursor-pointer"
        onClick={() => scrollToId("select-puzzles")}
      >
        More puzzles <span aria-hidden="true">↓</span>
      </p>
    </div>
  )
}

export default NumPad
