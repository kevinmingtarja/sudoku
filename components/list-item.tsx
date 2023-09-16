import { LiHTMLAttributes } from "react"

type ListItemProps = LiHTMLAttributes<HTMLLIElement> & {
  id: string
  text: string
  isSelected: boolean
}

const ListItem = ({ id, text, isSelected, ...props }: ListItemProps) => {
  return (
    <li
      {...props}
      key={id}
      className="flex justify-between gap-x-6 py-5 cursor-pointer"
    >
      <div className="flex min-w-0 gap-x-4">
        <p className="text-sm font-semibold leading-6 text-gray-900">{text}</p>
      </div>
      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        {isSelected && (
          <div className="mt-1 flex items-center gap-x-1.5">
            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            </div>
            <p className="text-xs leading-5 text-gray-500">In Progress</p>
          </div>
        )}
      </div>
    </li>
  )
}

export default ListItem
