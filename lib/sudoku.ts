import assert from "assert"
import { FlattenedMatrix, getColIdx, getRowIdx, getSubgridIdx } from "./matrix"

export type Cell = {
  value: string
  isEditable: boolean
  isInvalid: boolean
}

/**
 * Given an array of sudoku cells, returns the set of invalid cells,
 * and a map of the rows, columns, and subgrids, to support
 * fast lookups of whether a value already exists
 * in a given row, column, or subgrid.
 * @param {Cell[]} cells
 * @returns { Set<number>(), FlattenedMatrix<number>, FlattenedMatrix<number>, FlattenedMatrix<number> }
 */
export const initializeInvalidCells = (cells: Cell[]) => {
  if (cells.length !== 81) {
    throw new Error("Expected 81 cells")
  }
  // cols = [f f f f t f f f f | T f t f f f f f f | ...]
  //         0 1 2 3 4 5 6 7 8 | 0 1 2 3 4 5 6 7 8 | ...]
  //              col 0                col 1

  const invalidCells = new Set<number>()
  const rowsMap = new FlattenedMatrix<number>(9, 9, new Array(81).fill(0))
  const colsMap = new FlattenedMatrix<number>(9, 9, new Array(81).fill(0))
  const subgridsMap = new FlattenedMatrix<number>(9, 9, new Array(81).fill(0))

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].value === ".") continue

    const row = getRowIdx(i)
    const col = getColIdx(i)
    const subgrid = getSubgridIdx(i)

    if (
      rowsMap.get(row, col) !== 0 ||
      colsMap.get(row, col) !== 0 ||
      subgridsMap.get(row, col) !== 0
    ) {
      assert(cells[i].isEditable === false, "Input sudoku is invalid")

      // if an uneditable cell already exists, we don't want to
      // overwrite it
      if (cells[i].isEditable) {
        invalidCells.add(i)
        if (rowsMap.get(row, col) !== 0) {
          invalidCells.add(rowsMap.get(row, col))
        }
        if (colsMap.get(row, col) !== 0) {
          invalidCells.add(colsMap.get(row, col))
        }
        if (subgridsMap.get(row, col) !== 0) {
          invalidCells.add(subgridsMap.get(row, col))
        }

        continue
      }
    }

    const value = parseInt(cells[i].value, 10)
    const idx = value - 1

    rowsMap.put(row, idx, i)
    colsMap.put(col, idx, i)
    subgridsMap.put(subgrid, idx, i)
  }

  return { invalidCells, rowsMap, colsMap, subgridsMap }
}
