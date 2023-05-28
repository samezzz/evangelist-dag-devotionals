import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-[0.1px] border-t-gray-400 dark:border-t-[#302e2e] text-gray-500 dark:text-gray-200">
      <div className="container flex flex-col-reverse justify-between px-6 pb-5 mx-auto space-y-5 md:flex-row md:space-y-0">
        {/* Logo and Social links container */}
        <div className="flex flex-col-reverse items-center justify-between space-y-12 md:flex-col md:space-y-0 md:items-start">
          <div className="mx-auto my-6 text-center md:hidden">&copy; 2023, DAILY COUNSEL. All rights reserved.</div>
        </div>
        {/* List Container */}
        <div className="flex justify-around space-x-32">
          <div className="flex flex-col space-y-3">
            <Link href="/" className="hover:text-orange-500 text-blue-500 underline">Home</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <Link href="/" className="hover:text-orange-500 text-blue-500 underline">About</Link>
          </div>
        </div>
        {/* Input Container */}
        <div className="flex flex-col justify-between">
        <div className="hidden md:block ">&copy; 2023, DAILY COUNSEL. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}