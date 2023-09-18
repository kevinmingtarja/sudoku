import { FlattenedMatrix, getColIdx, getRowIdx, getSubgridIdx } from "./matrix"

export const EMPTY_CELL = "."

/**
 * Given an array of sudoku cells, returns the set of invalid cells.
 * Runs in O(n^2) time, but since n is just 9, this won't be a problem.
 * @param {Cell[]} cells
 * @returns { Set<number>() }
 */
export const checkInvalidCells = (cells: Cell[]) => {
  if (cells.length !== 81) {
    throw new Error("Expected 81 cells")
  }

  const invalidCells = new Set<number>()
  const rowsMap = new FlattenedMatrix<Set<number>>(9, 9, new Array(81))
  const colsMap = new FlattenedMatrix<Set<number>>(9, 9, new Array(81))
  const subgridsMap = new FlattenedMatrix<Set<number>>(9, 9, new Array(81))

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].value === ".") continue

    const row = getRowIdx(i)
    const col = getColIdx(i)
    const subgrid = getSubgridIdx(i)

    const value = parseInt(cells[i].value, 10)
    const idx = value - 1

    const currRowSet = rowsMap.get(row, idx)
    if (currRowSet === undefined) {
      rowsMap.put(row, idx, new Set([i]))
    } else {
      currRowSet.add(i)

      // if currRowSet is defined, then a value already exists in the row
      currRowSet.forEach((cell) => {
        invalidCells.add(cell)
      })
      invalidCells.add(i)
    }

    const currColSet = colsMap.get(col, idx)
    if (currColSet === undefined) {
      colsMap.put(col, idx, new Set<number>([i]))
    } else {
      currColSet.add(i)

      // if currColSet is defined, then a value already exists in the col
      currColSet.forEach((cell) => {
        invalidCells.add(cell)
      })
      invalidCells.add(i)
    }

    const currSubgridSet = subgridsMap.get(subgrid, idx)
    if (currSubgridSet === undefined) {
      subgridsMap.put(subgrid, idx, new Set<number>([i]))
    } else {
      currSubgridSet.add(i)

      // if currSubgridSet is defined, then a value already exists in the subgrid
      currSubgridSet.forEach((cell) => {
        invalidCells.add(cell)
      })
      invalidCells.add(i)
    }
  }

  return invalidCells
}

export const isValidInput = (cellIdx: number, value: string): boolean => {
  const intValue = parseInt(value, 10)
  return (
    cellIdx >= 0 &&
    cellIdx <= 80 &&
    (value === "." || (intValue >= 1 && intValue <= 9))
  )
}
