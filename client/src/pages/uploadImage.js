import React, { useState, useRef } from 'react';
import axios from 'axios';
import Navbar from './components/navBar/navBar';
import ParticlesJS from './components/particle/index.js';
import Footer from './components/footer';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router'
import Image from 'next/image';

function App() {
  const toast = useToast();
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState(null);
  const [Emage, setEmage] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      // No image selected, show the message to upload an image
      setEmage(null);
      setSelectedFile(null);
      setUploadMessage('Choose an image to upload.');
      return;
    }

    // Image selected
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setEmage(e.target.result);
      setUploadMessage(''); // Clear the message when an image is selected
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    // Check if selectedFile is null or empty
    if (!selectedFile) {
      // Handle the error or set an error state
      console.error('No file selected for upload.');
      // You might want to set an error state here if needed
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
      console.log('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      setSuccess(false);
    } finally {
      setLoading(false);
      setSuccess(true);
    }
  };

  if (success) {
    const alertMessage = success ? 'Image uploaded successfully.' : 'Error sending Image. Please try again.';
    toast({
      title: alertMessage,
      status: success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  }

  return (
    <>
      <ParticlesJS />
      <div>
        <div className='flex items-center justify-between bg-gray-900 p-4'>
          <h1 className='text-lg text-white text-center flex-grow'>
            Never miss the Moments
          </h1>
          {/* Enter OTP Code */}
          <div className="text-md">
            <button onClick={() => { router.push('/') }} className='text-white bg-blue-950 rounded-2xl px-3 py-2'>
              Enter OTP
            </button>
          </div>
        </div>


        <div>
          <h1 className='text-black font-medium text-3xl text-center p-5 mt-8'>
            Uploads the moments you captured.
          </h1>
        </div>
        <div className='flex justify-center items-center flex-col mt-10'>
          <h1 className='text-black font-semibold'>Click on the Image to Upload.</h1>
          <h1 className='text-black font-bold'>Photo Gallery.</h1>
          <div>
            <label htmlFor="upload-button">
              <div
                style={{
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
                className='border border-gray-500 mt-2 mb-4 shadow-inner bg-gray-300 drop-shadow-2xl'
              >
                {Emage ? (
                  <Image
                    src={Emage}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    src="./test.jpg"
                    alt="Upload Image"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
            </label>
          </div>
          <input className='hidden' type="file" ref={fileInputRef} onChange={handleFileChange} id='upload-button' />
          <div>
            {
              loading ? (
                <span style={{ color: 'blue' }}>&lsquo;Uploading, Please wait...&rsquo;</span>
              ) : success ? (
                <span style={{ color: 'green' }}>&lsquo;Image uploaded successfully.&rsquo;</span>
              ) : (
                <span style={{ color: 'black' }}>&lsquo;Choose an Image from Gallery.&rsquo;</span>
              )
            }

          </div>
          <button
            className='bg-black text-white p-4 mt-10 rounded-2xl w-48 mb-24'
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Uploading' : success ? 'Upload New Image' : 'Upload Image'}
          </button>
        </div>

        {/* Footer */}
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
