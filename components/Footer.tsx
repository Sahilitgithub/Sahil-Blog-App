import { Facebook, Instagram, Linkedin, Store } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full px-3 md:px-10 bg-black text-white p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* About Part */}
        <div className="bg-slate-900 rounded-md p-3">
          <h2 className="text-[17px] lg:text-[20px] text-green-700 font-semibold">About</h2>
          <p className="text-sm">Assalamu Alaikum Everyone, <br/>
          I am the founder of <Link href={`https://www.onlineshopbds.com.bd`} className="text-blue-700 underline font-semibold" >onlineshopbds.com.bd</Link>. Our platform provides valuable insights on how to start and build an online business in Bangladesh, focusing on clothing brands, digital products, and halal ways of making money online. We are dedicated to guiding you towards success while maintaining ethical business practices.</p>
        </div>
        {/* Guest Post Part */}
        <div className="bg-slate-900 rounded-md p-3">
          <h2 className="text-[17px] lg:text-[20px] text-green-700 font-semibold">Guest Post</h2>
          <ul className="text-sm">
            <li>&#9993; onlineshopbds2024@gmail.com</li>
            <li>&#9742; 01904789786</li>
          </ul>
        </div>
        {/* Social Media Part */}
        <div className="bg-slate-900 rounded-md p-3">
          <h2 className="text-[17px] lg:text-[20px] text-green-700 font-semibold">Follow Us</h2>
          <ul className="flex justify-start items-center gap-1">
            <li>
              <Link href="https://www.facebook.com/onlineshopbdsbysahilit" target="_blank" rel="noopener noreferrer" 
              className="hover:bg-black rounded-md p-1 inline-block bg-sky-600 transition-colors" >
                <Facebook />
              </Link>
            </li>
            <li>
              <Link href="https://www.instagram.com/onlineshopbds" target="_blank" rel="noopener noreferrer" 
              className="hover:bg-black rounded-md p-1 inline-block bg-sky-600 transition-colors" >
                <Instagram />
              </Link>
            </li>
            <li>
              <Link href="https://www.linkedin.com/in/sahil-it-171761215" target="_blank" rel="noopener noreferrer" 
              className="hover:bg-black rounded-md p-1 inline-block bg-sky-600 transition-colors" >
                <Linkedin />
              </Link>
            </li>
            <li>
              <Link href="https://www.onlineshopbds.com.bd" target="_blank" 
              className="hover:bg-black rounded-md p-1 inline-block bg-sky-600 transition-colors" >
                <Store />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-t-amber-500 text-[14px] md:text-[15px] text-center py-4">
        <p>&copy; All rights reserved - {new Date().getFullYear()} - By Sahil-it</p>
      </div>
    </footer>
  )
}

export default Footer
