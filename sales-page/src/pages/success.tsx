"use client"
import React from 'react'
import Link from 'next/link'

export default function Success() {
  return (
      <div className='w-full min-h-[100vh] flex flex-col items-center justify-center'>
          <h2 className='text-3xl font-bold mb-4'>Payment Sucessful!</h2>
           <Link href="/" className='bg-purple-50 hover:bg-purple-100 text-purple-600 px-5 py-3 rounded-2xl text-lg font-semibold' 
          >Go Home</Link>
      </div>
  )
}
