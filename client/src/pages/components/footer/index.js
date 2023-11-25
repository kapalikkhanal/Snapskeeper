import React from 'react'
import { useRouter } from 'next/router'

function Footer() {
    const router = useRouter()
    return (
        <div>
            <footer
                className="bg-gray-900 text-lg text-white text-center fixed 
             inset-x-0 
             bottom-0 
             p-4
             font-medium">
                Need a QR Code?
                <button onClick={() => { router.push('/qrCode') }} className='text-gray-200 p-1 m-2 bg-blue-900 rounded-2xl'>&nbsp;Contact Us&nbsp;</button>
            </footer>
        </div>
    )
}

export default Footer