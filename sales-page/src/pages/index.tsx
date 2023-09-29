import Image from 'next/image'
import { Inter } from 'next/font/google'
import headerImage from "../images/headerImage.jpg"
import { FaChalkboardTeacher } from "react-icons/fa"
import { IoDocumentTextSharp } from "react-icons/io5"
import { BsFillClockFill } from "react-icons/bs"
import {AiFillCheckCircle} from "react-icons/ai"
import buy from "../images/buy.png"
const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const handlePayment = async () => {
    try {
    const data = await fetch("/api/payment")
      const response = await data.json();
      window.location.assign(response.session)
  } catch (err) {
    console.error(err);
    }
  }
  return (
    <main
      className={` ${inter.className}`}
    >
      {/* --- Navigation bar --- */}
      <nav className='md:h-[12vh] w-full md:p-8 p-4 flex items-center justify-between border-b-[1px] border-b-gray-200 bg-white sticky top-0 z-20'>
        <h2 className='text-2xl font-bold text-purple-600'>TechGrow</h2>
        <button className='bg-purple-600 hover:bg-purple-800 text-white px-5 py-3 rounded-2xl'
          onClick={() => handlePayment()}>Get Started</button>
      </nav>
         {/* --- Header Jumbotron --- */}
      <header className='min-h-[88vh] w-full md:px-8 px-4 py-12 flex md:flex-row flex-col items-center justify-between'>
        <div className='md:w-[60%] w-full md:pr-6 md:mb-0 mb-8'>
          <h2 className='font-extrabold text-5xl mb-4'>Future-Proof Your Career with Top Digital Skills! </h2>
          <p className='opacity-60 mb-4'>Unlock your full potential of a future-proof career through the power of top digital skills with our all-in-one growth package.</p>
          <button className='bg-purple-600 hover:bg-purple-800 w-[200px] text-white px-5 py-3 rounded-2xl text-lg font-semibold' onClick={() => handlePayment()}>Get Started</button>
          
        </div>
        <div className='md:w-[40%] w-full'>
          <Image src={headerImage} alt='Man smiling' className='rounded-lg' />
        </div>
      </header>
       {/* --- Features Section --- */}
      <section className='w-full min-h-[88vh] bg-purple-50 md:px-8 px-4 py-14 '>
        <h2 className='font-extrabold text-3xl text-center mb-4'>Why Choose Us?</h2>
        <p className='opacity-50 text-center'>Unlock your full potential of a future-proof career</p>
        <p className='opacity-50 mb-14 text-center'> that surpasses your expectation.</p>
        <div className='flex w-full items-center justify-between md:space-x-6 md:flex-row flex-col'>
          <div className='md:w-1/3 md:mb-0 mb-6 w-full bg-white rounded-xl px-5 py-8 hover:border-[1px] hover:border-purple-600 hover:shadow-md'>
            <div className='rounded-full p-4 bg-purple-50 max-w-max mb-2'>
              <FaChalkboardTeacher className="text-2xl text-purple-800"/>
            </div>
            <p className='font-bold text-lg mb-2'>Expert instructors</p>
            <p className='text-sm opacity-50'>Learn from industry experts, gaining unique insights which cannot be found elsewhere.</p>
          </div>
           <div className='md:w-1/3 md:mb-0 mb-6 w-full bg-white rounded-xl px-5 py-8 hover:border-[1px] hover:border-purple-600 hover:shadow-md'>
            <div className='rounded-full p-4 bg-purple-50 max-w-max mb-2'>
              <IoDocumentTextSharp className="text-2xl text-purple-800"/>
            </div>
            <p className='font-bold text-lg mb-2'>Hands-On Projects</p>
            <p className='text-sm opacity-50'>Learn practical, real-world digital skills through relevant projects and interactive sessions.</p>
          </div>
           <div className='md:w-1/3 md:mb-0 mb-6 w-full bg-white rounded-xl px-5 py-8 hover:border-[1px] hover:border-purple-600 hover:shadow-md'>
            <div className='rounded-full p-4 bg-purple-50 max-w-max mb-2'>
              <BsFillClockFill className="text-2xl text-purple-800"/>
            </div>
            <p className='font-bold text-lg mb-2'>Lifetime Access</p>
            <p className='text-sm opacity-50'>Unlimited lifetime access for continuous learning and personal growth.</p>
          </div>
        </div>
      </section>
       {/* --- Purchase Now Section--- */}
      <div className='w-full min-h-[70vh] py-14 md:px-12 px-4 bg-purple-700 flex md:flex-row flex-col items-center justify-between'>
         <div className='md:w-[50%] w-full md:pr-6 md:mb-0 mb-8'>
          <h2 className='font-extrabold text-5xl mb-4 text-purple-50'>Start learning and grow your skills today! </h2>
          <p className='mb-4 text-purple-300'>Unlock your full potential of a future-proof career through the power of top digital skills with our all-in-one growth package.</p>
          <div className='mb-6'>
            <div className='flex items-center space-x-3 mb-2'>
              <AiFillCheckCircle className="text-2xl text-green-300" />
              <p className='text-purple-50 text-sm opacity-80'>24/7 availability</p>
            </div>
            <div className='flex items-center space-x-3 mb-2'>
              <AiFillCheckCircle className="text-2xl text-green-300" />
              <p className='text-purple-50 text-sm opacity-80 '>Expert-led tutorials</p>
            </div>
             <div className='flex items-center space-x-3 mb-2'>
              <AiFillCheckCircle className="text-2xl text-green-300" />
              <p className='text-purple-50 text-sm opacity-80 '>High-quality contents</p>
            </div>
             <div className='flex items-center space-x-3 mb-2'>
              <AiFillCheckCircle className="text-2xl text-green-300" />
              <p className='text-purple-50 text-sm opacity-80 '>Hands-on practical and interactive sessions</p>
            </div>
          </div>
          <button className='bg-purple-50 hover:bg-purple-100 w-[200px] text-purple-600 px-5 py-3 rounded-2xl text-lg font-semibold' 
          onClick={() => handlePayment()}>Purchase Now</button>
          
        </div>
        <div className='md:w-[50%] w-full flex items-center justify-center'>
          <Image src={buy} alt='Man smiling' className='rounded-lg' />
        </div>
      </div>
        {/* --- Footer Section --- */}
      <footer className='w-full flex items-center justify-center min-h-[10vh] bg-white'>
        <p className='text-purple-800 text-sm'>Copyright, &copy; {new Date().getFullYear()} All Rights Reserved Tech Grow</p>
      </footer>
    </main>
  )
}
