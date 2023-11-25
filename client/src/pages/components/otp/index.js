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
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            // Send form data to the backend
            const response = await axios.post('https://indecisive-elite-maple.glitch.me/code', formData);
            console.log("Status", response.status);
            if (response.status === 200) {
                setSuccess(true);
                setLoading(false);
            }
            else {
                setLoading(flase);
                setSuccess(false);
            }
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setSuccess(false);
            setLoading(false);
        }
        finally {
            setLoading(false);
            setSuccess(true);
        }
    };

    useEffect(() => {
        // Use the useEffect hook to conditionally redirect after the success state is updated
        if (success === true) {
            router.push('/uploadImage');
        }
    }, [success, router]);

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
                    <div className='flex justify-center items-center mt-1'>
                        {
                            loading ? (
                                <span style={{ color: 'blue' }}>&lsquo;Verifying...&rsquo;</span>
                            ) : success ? (
                                <span style={{ color: 'green' }}>&lsquo;Verified.&rsquo;</span>
                            ) : (
                                <span style={{ color: 'black', textAlign: 'center' }}>&lsquo;Enter the 4 digit Code.&rsquo;</span>
                            )
                        }
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
