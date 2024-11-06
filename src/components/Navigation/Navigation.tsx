import Link from 'next/link'
import React from 'react'
import { ImagePlus, ScanText } from 'lucide-react';

const Navigation = () => {
  return (
    <div className='w-full flex flex-row justify-center gap-8 bg-gray-800 p-4 rounded-md text-gray-100'>
        <Link href="/" className='flex flex-row items-center gap-2'><ScanText className='w-6 h-6 ' />Converso SRT</Link>
        <Link href="/conversor-imagem" className='flex flex-row items-center gap-2'><ImagePlus className='w-6 h-6 ' />Converso Imagem</Link>
    </div>
  )
}

export default Navigation