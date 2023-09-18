import supabase from "@/lib/supabase"

import GameContainer from "@/components/game"

const Page = async () => {
  const { data: puzzles } = await supabase
    .from("sudoku_puzzles")
    .select("id, puzzle")

  if (!puzzles) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>
          Sorry this should not happen. Please contact kevin.mingtarja@gmail.com
          if you encounter this.
        </h1>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start w-full max-w-8xl px-8 py-8 lg:px-56 lg:py-16">
      <div className="flex w-full justify-start mb-6 lg:mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-3xl">
          Sudoku.
        </h1>
      </div>
      <GameContainer puzzles={puzzles} />
    </main>
  )
}

export default Page
