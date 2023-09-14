# sudoku

This is my submission for Mobbin's take home assignment.

## Tech Stack Notes

The requirements states that Next.js, Tailwind CSS, and Supabase should be used. But nonetheless, I will start by researching on what these technologies have to offer, since that will equip me with the necessary knowledge for the next steps.

- Next.js:
  The last time I used Next.js was when it was still v11.1. Right now, I see that there's [Next.js 13](https://nextjs.org/blog/next-13) which brought lots of core foundational changes to the framework. At first glance, it seems like the "new" [data fetching](https://nextjs.org/blog/next-13#data-fetching) paradigm it introduces will simplify a lot of things. Previously, I almost always use [SWR](https://swr.vercel.app/) (also created by Vercel) for data fetching, but I'm excited to give this new feature a try and compare the two.
- Tailwind CSS:
  I've also never used Tailwind CSS. I personally have always went with [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules) for styling, partly because of the local scoping they can do by creating unique class names. I also liked having the separation between the javascript stuff in the jsx/tsx files and the styling part in the css files. But anyways, I've always wanted to try Tailwind, and now is the time. I'm interested to compare and contrast between the two as well.
- Supabase:
  Another interesting tech that I haven't got the chance to try on. Interested to see what stuff they add on on top of a normal postgres.

## Design

### Functional Requirements

- A working and playable Sudoku web-based game
  - Persist the state between page close/refresh
- Load Sudoku puzzles from hard-coded puzzles stored on db
  - Allow users to pick from this list
  - Only one game can be in progress at any given time, progress will be lost if user starts a new game

### Non Functional Requirements

-

### Sudoku Data Structure

In the db, a puzzle is stored as a string of length 81 (9x9). In the frontend, we need to transform this to a data structure that allows for:

- Quick insertion of digits
- Quick checking of validity
- Differentiate cells that are prefilled vs editable
- (Future work) Give hints/answers, and check correctness (not validity) of the current state

Based on those requirements, I designed the data structure to be the following:

- Array of length 81
- Index corresponds to the cell number
- To get cell position: ((i//9), (i%9))
- Each element is an object of the following:
  - value: int
  - isEditable: bool

To check validity, we need to check each time a new digit is entered. We will maintain three hash maps in memory (row, col, sub-grid), which is constructed at the beginning of every game. Then at every step, we just update those maps. These maps will be a 9x9 matrix.

## Dev Setup

### Frontend

```bash
npm run dev
```

## Inspirations

- https://sudoku.com
- https://www.websudoku.com/
- https://www.nytimes.com/puzzles/sudoku

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
