import assert from "assert"
import { FlattenedMatrix, getColIdx, getRowIdx, getSubgridIdx } from "./matrix"

export type Cell = {
  value: string
  isEditable: boolean
  isInvalid: boolean
}

/**
 * Given an array of sudoku cells, returns the set of invalid cells.
 * @param {Cell[]} cells
 * @returns { Set<number>() }
 */
export const initializeInvalidCells = (cells: Cell[]) => {
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

export const isValidInput = (cellIdx: number, value: number): boolean => {
  return cellIdx >= 0 && cellIdx <= 80 && value >= 1 && value <= 9
}

// traverse the startingCell's row, col, subgrid
export const checkValidity = (startingCellIdx: number, cells: Cell[]) => {
  const row = getRowIdx(startingCellIdx)
  const col = getColIdx(startingCellIdx)
  const subgrid = getSubgridIdx(startingCellIdx)

  const value = parseInt(cells[startingCellIdx].value, 10)
  const idx = value - 1

  const invalidCells = new Set<number>()
  for (let i = 0; i < 9; i++) {
    // check row
    let currCellIdx = row * 9 + i
    if (
      currCellIdx !== startingCellIdx &&
      cells[currCellIdx].value === cells[startingCellIdx].value
    ) {
      // duplicate
      invalidCells.add(currCellIdx)
      invalidCells.add(startingCellIdx)
    }

    // check col
    currCellIdx = i * 9 + col
    if (
      currCellIdx !== startingCellIdx &&
      cells[currCellIdx].value === cells[startingCellIdx].value
    ) {
      // duplicate
      invalidCells.add(currCellIdx)
      invalidCells.add(startingCellIdx)
    }

    // check subgrid
    const currRow = Math.floor(i / 3)
    const currCol = i % 3
    currCellIdx = (subgrid * 3 + currRow) * 9 + (subgrid * 3 + currCol)
    if (
      currCellIdx !== startingCellIdx &&
      cells[currCellIdx].value === cells[startingCellIdx].value
    ) {
      // duplicate
      invalidCells.add(currCellIdx)
      invalidCells.add(startingCellIdx)
    }
  }

  return invalidCells
}
