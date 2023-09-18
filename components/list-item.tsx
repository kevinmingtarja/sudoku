import { LiHTMLAttributes } from "react"

const ListItem = ({
  text,
  isSelected,
  ...props
}: LiHTMLAttributes<HTMLLIElement> & {
  text: string
  isSelected: boolean
}) => {
  return (
    <li
      {...props}
      className="flex justify-between gap-x-6 py-5 items-center cursor-pointer"
    >
      <div className="flex min-w-0 gap-x-4">
        <p className="text-md font-semibold leading-6 text-gray-900">{text}</p>
      </div>
      <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
        {isSelected && (
          <div className="flex items-center gap-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/80 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <p className="text-sm text-gray-500">In Progress</p>
          </div>
        )}
      </div>
    </li>
  )
}

export default ListItem
