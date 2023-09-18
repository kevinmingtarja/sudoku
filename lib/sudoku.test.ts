import { describe, expect, test } from "@jest/globals"
import { initializeInvalidCells } from "@/lib/sudoku"

describe("testInitializeInvalidCells", () => {
  test("valid sudoku 0", () => {
    const expectedInvalidCells = new Set<number>()

    const input =
      "52...6.........7.13...........4..8..6......5...........418.........3..2...87....."
    const cells: Cell[] = new Array(81).fill(0)
    for (let i = 0; i < 81; i++) {
      cells[i] = {
        value: input[i],
        isEditable: input[i] === ".",
        isInvalid: false, // assume all initial values are valid
      }
    }

    const invalidCells = initializeInvalidCells(cells)

    expect(invalidCells).toEqual(expectedInvalidCells)
  })

  test("invalid sudoku 0", () => {
    const expectedInvalidCells = new Set<number>()

    const input =
      "52...5.........7.15...........4..8..6......5...........418.........3..2...87....."
    const cells: Cell[] = new Array(81).fill(0)
    for (let i = 0; i < 81; i++) {
      cells[i] = {
        value: input[i],
        isEditable: input[i] === ".",
        isInvalid: false, // assume all initial values are valid
      }
    }

    expectedInvalidCells.add(0)
    expectedInvalidCells.add(5)
    expectedInvalidCells.add(18)

    const invalidCells = initializeInvalidCells(cells)

    expect(invalidCells).toEqual(expectedInvalidCells)
  })

  test("invalid sudoku 1", () => {
    const expectedInvalidCells = new Set<number>()

    const input =
      "52...5.........7.13...........5..5..6......5...........418.........3..2...87....."
    const cells: Cell[] = new Array(81).fill(0)
    for (let i = 0; i < 81; i++) {
      cells[i] = {
        value: input[i],
        isEditable: input[i] === ".",
        isInvalid: false, // assume all initial values are valid
      }
    }

    expectedInvalidCells.add(0)
    expectedInvalidCells.add(5)
    expectedInvalidCells.add(30)
    expectedInvalidCells.add(33)
    expectedInvalidCells.add(43)

    const invalidCells = initializeInvalidCells(cells)

    expect(invalidCells).toEqual(expectedInvalidCells)
  })
})