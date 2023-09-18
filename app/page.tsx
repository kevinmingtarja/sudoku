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
    <main className="flex min-h-screen flex-col items-center justify-start w-full max-w-8xl px-56 py-16 sm:py-16 lg:py-16">
      <div className="flex w-full justify-start mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Sudoku.
        </h1>
      </div>
      <GameContainer puzzles={puzzles} />
    </main>
  )
}

export default Page
