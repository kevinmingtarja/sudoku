import supabase from "@/lib/supabase"

import GameContainer from "./game"

const Page = async () => {
  const { data: puzzles } = await supabase
    .from("sudoku_puzzles")
    .select("id, puzzle")

  if (!puzzles) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>There are no sudoku puzzles</h1>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Sudoku</h1>
      <GameContainer puzzles={puzzles} />
    </main>
  )
}

export default Page
