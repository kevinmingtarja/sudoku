import supabase from "@/lib/supabase"

export default async function Home() {
  const { data: sudoku } = await supabase.from("sudoku_puzzles").select()
  console.log(sudoku)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(sudoku, null, 2)}
    </main>
  )
}
