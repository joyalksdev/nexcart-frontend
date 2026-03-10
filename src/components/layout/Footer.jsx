import React from 'react'
import Logo from '../../assets/Logo'
import { Link } from 'react-router-dom'

const socialIconStyle =
  "w-9 h-9 rounded bg-[#ffffff0f] border border-[#ffffff14] flex items-center justify-center text-sm cursor-pointer transition duration-200 hover:bg-(--primary) hover:border-(--primary)"

const Footer = () => {
  return (
    <footer className="bg-(--text) text-[#ffffff99] px-6 md:px-12 lg:px-30 pt-10 pb-5">

      <div className="max-w-7xl mx-auto">

        {/* Top section */}
        <div className="grid sm:grid-cols-2 lg:flex lg:justify-between items-start gap-11 pb-10 text-(--text-heading) border-b border-[#ffffff14]">

          <div className="text-white flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2">
                  <div className="px-2.5 py-2.5 rounded-lg bg-[#4F46E5] flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                  <h2 className="font-(--font-heading) logo text-2xl tracking-tight">
                    Nex<span className="text-(--primary) font-extrabold">Cart</span>
                  </h2>
                </Link>
            <p className="text-sm text-[#ffffff66] max-w-60">
              Premium shopping, minimal design. Everything you need, nothing you don't.
            </p>
          </div>

          <div>
            <h4 className="text-white tracking-wide uppercase mb-2.5 font-bold">Shop</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to='/products' className='hover:text-white transition duration-300'>Products</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Electronics</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Clothing</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Home & Living</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Beauty</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white tracking-wide uppercase mb-2.5 font-bold">Account</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to='/' className='hover:text-white transition duration-300'>My Orders</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Wishlist</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Profile</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white tracking-wide uppercase mb-2.5 font-bold">Company</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to='/' className='hover:text-white transition duration-300'>About NexCart</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Contact Us</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Privacy Policy</Link></li>
              <li><Link to='/' className='hover:text-white transition duration-300'>Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-7">

          <span className="text-sm text-center md:text-left">
            © 2025 NexCart. All rights reserved.
          </span>

          <div className="flex gap-2.5">
            <div className={socialIconStyle}>𝕏</div>
            <div className={socialIconStyle}>f</div>
            <div className={socialIconStyle}>in</div>
            <div className={socialIconStyle}>▶</div>
          </div>

        </div>

      </div>

    </footer>
  )
}

export default Footer