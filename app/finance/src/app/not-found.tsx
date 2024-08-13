import Link from "next/link"

export default function NotFoundComponent() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black text-white font-inter">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-[96px] font-bold">404</h1>
        <p className="mt-4 text-2xl">Oops, page not found</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition-colors hover:bg-gray focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          prefetch={false}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  )
}
