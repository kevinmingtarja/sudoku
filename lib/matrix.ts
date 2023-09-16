export class FlattenedMatrix<T> {
  height: number
  width: number
  array: T[]

  constructor(height: number, width: number, array: T[]) {
    this.height = height
    this.width = width
    this.array = array
  }

  get(row: number, col: number) {
    return this.array[row * this.width + col]
  }

  put(row: number, col: number, value: T) {
    this.array[row * this.width + col] = value
  }
}

export const getRowIdx = (cell: number) => {
  return Math.floor(cell / 9)
}

export const getColIdx = (cell: number) => {
  return cell % 9
}

export const getSubgridIdx = (cell: number) => {
  const row = getRowIdx(cell)
  const col = getColIdx(cell)
  return Math.floor(row / 3) * 3 + Math.floor(col / 3)
}

export const getCellIdx = (row: number, col: number) => {
  return row * 9 + col
}

export const convertToMatrix = <T>(cells: T[]) => {
  return cells.reduce<T[][]>((rows, cell, idx) => {
    if (idx % 9 === 0) {
      rows.push([cell])
    } else {
      rows[rows.length - 1].push(cell)
    }
    return rows
  }, [])
}
