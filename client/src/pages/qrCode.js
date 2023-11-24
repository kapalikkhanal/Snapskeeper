import React from 'react';
import QrCode from './components/qrCode';
import Navbar from './components/navBar/navBar';
import ContactForm from './components/form';

function QrCodePage() {


  return (
    <div>
      <Navbar />
      <QrCode />
      <ContactForm />
    </div>
  );
}

export default QrCodePage;
