// File: components/Layout.js
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
      <nav className="w-full p-4 bg-gray-100 fixed top-0 z-10">
        <ul className="flex space-x-6 justify-center">
          <li>
            <Link href="#player">Player</Link>
          </li>
          <li>
            <Link href="#years">Years</Link>
          </li>
          <li>
            <Link href="#songs">Songs</Link>
          </li>
        </ul>
      </nav>
      <main className="pt-16 flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
