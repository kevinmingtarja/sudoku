/**
 * FlattenedMatrix is a 2D Matrix represented as a 1D array.
 * On paper this should be faster since it has better memory locality,
 * but it depends really on how the javascript engine does things.
 * This of course is a trades off readability, which is why
 * this class along with its helper methods are created.
 */
export class FlattenedMatrix<T> {
  height: number
  width: number
  array: T[]

  constructor(height: number, width: number, array: T[]) {
    this.height = height
    this.width = width
    this.array = array
  }

  /**
   * Retrieves an element located in [row][col]
   * @param row row in 2D matrix representation
   * @param col col in 2D matrix representation
   * @returns
   */
  get(row: number, col: number) {
    return this.array[row * this.width + col]
  }

  /**
   * Assigns an element to [row][col]
   * @param row row in 2D matrix representation
   * @param col col in 2D matrix representation
   * @param value value to be assigned
   */
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
