# sudoku

This is my submission for Mobbin's take home assignment.

## Features

- Full keyboard support:
  - Use arrows to move around the board
  - Numbers to input values
  - Backspace to delete existing entries
  - Space to pause/unpause
  - Escape to deselect any cells
- Mobile and table responsive
- Multiple puzzles
- Automatic pause everytime you leave or close the tab
- Saved progress even if you leave and close the tab

## Tech Stack Notes

The requirements states that Next.js, Tailwind CSS, and Supabase should be used. But nonetheless, I will start by researching on what these technologies have to offer, since that will equip me with the necessary knowledge for the next steps.

- Next.js:
  The last time I used Next.js was when it was still v11.1. Right now, I see that there's [Next.js 13](https://nextjs.org/blog/next-13) which brought lots of core foundational changes to the framework. At first glance, it seems like the "new" [data fetching](https://nextjs.org/blog/next-13#data-fetching) paradigm it introduces will simplify a lot of things. Previously, I almost always use [SWR](https://swr.vercel.app/) (also created by Vercel) for data fetching, but I'm excited to give this new feature a try and compare the two.
- Tailwind CSS:
  I've also never used Tailwind CSS. I personally have always went with [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules) for styling, partly because of the local scoping they can do by creating unique class names. I also liked having the separation between the javascript stuff in the jsx/tsx files and the styling part in the css files. But anyways, I've always wanted to try Tailwind, and now is the time. I'm interested to compare and contrast between the two as well.
- Supabase:
  Another interesting tech that I haven't got the chance to try on. Interested to see what stuff they add on on top of a normal postgres.
- Chakra UI:
  Has been my go-to for component libraries. Unfortunately, it only works in client-side components, but that's not too big of a problem for this project.

## Design

### Functional Requirements

- A working and playable Sudoku web-based game
  - Persist the state between page close/refresh
- Load Sudoku puzzles from hard-coded puzzles stored on db
  - Allow users to pick from this list
  - Only one game can be in progress at any given time, progress will be lost if user starts a new game

### Sudoku Data Structure

In the db, a puzzle is stored as a string of length 81 (9x9). In the frontend, we need to transform this to a data structure that allows for:

- Quick insertion of digits
- Quick checking of validity
- Differentiate cells that are prefilled vs editable
- Mark cells that are breaking the rules
- (Future work) Give hints/answers, and check correctness (not validity) of the current state

Based on those requirements, I designed the data structure to be the following:

- Array of length 81
- Index corresponds to the cell number
- To get (row, col) position: ((i//9), (i%9))
- Each element is an object of the following:
  - value: int
  - isEditable: bool
  - isInvalid: bool

To check validity, we need to check each time a new digit is entered. Right now, we are iterating through all 81 cells of the current state, and then checking whether each row, column, and subgrid has a duplicate or not. We use three hashmaps (represented as flattened 1D array), to support O(1) checking of duplicates in every iteration. This is done by `checkInvalidCells(cells: Cell[])` in `sudoku.ts`.

## Dev Setup

### Frontend

Prerequisites: Create a `.env.local` and put the Supabase credentials there.

```bash
npm run dev
```

## Deployment

This site is deployed with Vercel. Every push to main automatically gets deployed and promoted to production.

---

## Tested On

- Chrome (v116.0)
- Safari (v15.4)

## Known Issues

- On Safari, the styling of the right border of the column groups are a bit off. On Chrome it works fine
- Styling of the numpad breaks (the gap between numpad buttons) when width is around 1030px, right around the boundary between md and lg breakpoints.

## Design Inspirations

- https://sudoku.com
- https://www.nytimes.com/puzzles/sudoku
