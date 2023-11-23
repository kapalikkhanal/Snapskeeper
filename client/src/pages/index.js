import React, { useState, useRef } from 'react';
import axios from 'axios';
import Navbar from './components/navBar/navBar';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [Emage, setEmage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file)

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEmage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully. File ID:', response.data.fileId);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <h1 className='text-black font-medium text-3xl text-center p-5 mt-8'>
          Uploads the moments your captured.
        </h1>
      </div>
      <div className='flex justify-center items-center flex-col mt-10'>
        <h1 className='text-black'>Click on the Image to Upload.</h1>
        <h1>Photo Gallery</h1>
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
                <img
                  src={Emage}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src="./test.jpg"
                  alt="Upload Image"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

            </div>
          </label>
        </div>
        <input className='hidden' type="file" ref={fileInputRef} onChange={handleFileChange} id='upload-button' />
        <button className='bg-black p-4 mt-10 rounded-2xl w-40'
          onClick={handleUpload}>
          Upload Image
        </button>
      </div>
    </div>
  );
}

export default App;
