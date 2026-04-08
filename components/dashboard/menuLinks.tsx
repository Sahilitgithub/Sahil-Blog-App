import Link from 'next/link';
import React, { JSX } from 'react'

interface MenuItem {
  title: string;
  icon: JSX.Element;
  path: string;
}

const MenuLinks = ({ LinkItem }: { LinkItem: MenuItem }) => {
  return (
    <Link href={LinkItem.path} className='flex gap-1 text-[14px] sm:text-[15px] my-3 hover:bg-sky-700 p-1 transition-colors'>
      {LinkItem.icon}
      {LinkItem.title}
    </Link>
  )
}

export default MenuLinks
