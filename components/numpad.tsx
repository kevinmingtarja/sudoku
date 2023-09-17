const NumPad = ({ handleClick }: { handleClick: (value: number) => void }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 9 }, (_, idx) => (
        <button
          key={idx}
          className="p-4 text-2xl font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => handleClick(idx + 1)}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  )
}

export default NumPad
