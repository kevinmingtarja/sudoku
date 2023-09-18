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
      <div className="flex gap-0 h-fit mb-4 lg:mb-2 lg:gap-3 lg:grid lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, idx) => (
          <Button
            key={idx}
            className="p-0 min-w-0 bg-transparent hover:bg-transparent w-8 h-8 md:w-16 md:h-16 lg:bg-gray-200 lg:hover:bg-gray-300 lg:w-20 lg:h-20"
            onClick={() => handleClick(idx + 1)}
          >
            <p className="text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
              {idx + 1}
            </p>
          </Button>
        ))}
      </div>
      <Button
        className="bg-gray-200 w-full md:h-12 hover:bg-gray-300 lg:h-16"
        onClick={handleDelete}
      >
        <p className="text-xl font-bold text-gray-900 lg:text-3xl">X</p>
      </Button>

      <p
        className="text-md font-bold text-gray-900 mt-4 md:mt-8 cursor-pointer lg:text-xl lg:mt-28"
        onClick={() => scrollToId("select-puzzles")}
      >
        More puzzles <span aria-hidden="true">↓</span>
      </p>
    </div>
  )
}

export default NumPad
