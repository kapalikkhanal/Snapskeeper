import React from 'react'
import OtpCode from './components/otp'
import Navbar from './components/navBar/navBar'
import Footer from './components/footer'
import ParticlesJS from './components/particle/index.js';

function index() {
    return (
        <div>
            <ParticlesJS />
            <Navbar />
            <OtpCode />
            <Footer />
        </div>
    )
}

export default index