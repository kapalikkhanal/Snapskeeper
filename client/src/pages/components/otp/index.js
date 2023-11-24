import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router'

function OtpCode() {
    const router = useRouter()
    const toast = useToast();
    const [formData, setFormData] = useState({
        code: '',
    });
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send form data to the backend
            const response = await axios.post('http://localhost:3001/code', formData);
            console.log("Status", response.status);
            if (response.status === 200) {
                setSuccess(true);
            }
            else {
                setSuccess(false);
            }
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setSuccess(false);
        }
    };

    { success ? router.push('/uploadImage') : <h1 className='text-black text-center'>Incorrect OTP.</h1> }

    return (
        <div>
            <div>
                <div>
                    <h1 className='text-black font-bold text-3xl text-center p-5 mt-12 m-2'>
                        Verify the Code.
                    </h1>
                </div>
                <div>
                    <h1 className='text-black font-medium text-xl text-center p-5 mt-8 m-3'>
                        You can find the code under the QR Card or ask the Owner.
                    </h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='flex justify-center mt-12'>
                        <div className='flex flex-col w-48 items-center border-b border-black shadow-2xl py-2'>
                            <input
                                className="appearance-none bg-transparent border-none w-full text-center font-bold text-black placeholder:text-red-900 py-1 px-2 leading-tight focus:outline-none"
                                type="text"
                                placeholder="Enter the Code"
                                aria-label="code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        {/* {success ? router.push('/uploadImage') : <h1 className='text-black text-center'>Incorrect OTP.</h1>} */}
                    </div>

                    <div className='flex justify-center'>
                        <div>
                            <button
                                className='bg-black text-white p-4 mt-12 rounded-2xl w-40 mb-24'
                                type="submit"
                            >
                                Enter
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <footer
                className="bg-gray-900 text-lg text-white text-center fixed inset-x-0 bottom-0 p-4 font-bold">
                Go back to
                <button onClick={() => { router.push('/') }} className='text-gray-200 p-1 m-2 bg-blue-900 rounded-2xl'>&nbsp;Upload photos.&nbsp;</button>
            </footer>
        </div>
    );
}

export default OtpCode;
