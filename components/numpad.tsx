import { Button } from "@chakra-ui/react"

const NumPad = ({
  handleClick,
  handleDelete,
}: {
  handleClick: (value: number) => void
  handleDelete: () => void
}) => {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 h-fit gap-3 mb-2">
        {Array.from({ length: 9 }, (_, idx) => (
          <Button
            key={idx}
            className="bg-gray-200 w-16 h-16 hover:bg-gray-300"
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
    </div>
  )
}

export default NumPad
