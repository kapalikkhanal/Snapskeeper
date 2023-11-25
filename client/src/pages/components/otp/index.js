import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router'
import Image from 'next/image';
import Footer from '../footer';

function OtpCode() {
    const router = useRouter()
    const toast = useToast();
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [formData, setFormData] = useState({
        code1: '',
        code2: '',
        code3: '',
        code4: '',
    });

    const [fullCode, setFullCode] = useState();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the state for the current input
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        // Concatenate all code values
        const concatenatedCode = Object.values({
            ...formData,
            [name]: value,
        }).join('');

        setFullCode(concatenatedCode);
        // If the current input is not the last one
        if (name !== 'code4') {
            // Find the next input name
            const nextInput = `code${parseInt(name[name.length - 1], 10) + 1}`;
            // Focus on the next input
            document.getElementsByName(nextInput)[0].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Send form data to the backend
            console.log("Fullcode:", fullCode)
            const response = await axios.post('https://indecisive-elite-maple.glitch.me/code', { code: fullCode });
            console.log("Status", response.status);
            if (response.status === 200) {
                setSuccess(true);
                setLoading(false);
                setError(false);
            }
            else {
                setLoading(false);
                setSuccess(false);
                setError(true);
            }
        } catch (error) {
            console.error('Error submitting form:', error.message);
            setSuccess(false);
            setLoading(false);
            setError(true);
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
                        Verification Code.
                    </h1>
                </div>
                <div>
                    <h1 className='text-black font-medium text-xl text-center p-5 mt-8 m-3'>
                        A 4-digit code that is under the QR Code, or ask the organizer.
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='flex justify-center items-center mt-12'>
                        {loading ? (
                            <Image className='bg-inherit' src="/loading.gif" width={25} height={20} alt="Ripple SVG" />
                        ) : success ? (
                            ''
                        ) : (
                            <div>
                                {error ? (
                                    <span className='text-red-500 font-bold animate-bounce'>&lsquo;Incorrect OTP&rsquo;</span>
                                ) : (
                                    <span className='text-black font-semibold animate-bounce mt-2'>&lsquo;Enter the 4-digit code&rsquo;</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='flex justify-center mt-2'>
                        <div className='flex flex-row w-48 space-x-4 items-center py-2'>
                            <input
                                className="appearance-none bg-transparent border-b border-black bg-[#fcc4c4] rounded-md shadow-inner w-12 text-center font-bold text-black placeholder:text-gray-900 placeholder:opacity-50 py-4 px-4 leading-tight focus:outline-none"
                                type="number"
                                aria-label="code"
                                placeholder='0'
                                name="code1"
                                value={formData.code1}
                                onChange={handleChange}
                                inputMode="numeric" // This suggests a numeric keyboard on mobile devices
                                maxLength={1} // Limits the input to 4 characters
                                pattern="[0-9]*" // Allows only numeric characters
                                title="Please enter only numeric characters" // Displayed as a tooltip
                                required
                            />
                            <input
                                className="appearance-none bg-transparent border-b border-black bg-[#fcc4c4] rounded-md shadow-inner w-12 text-center font-bold text-black placeholder:text-gray-900 placeholder:opacity-50 py-4 px-4 leading-tight focus:outline-none"
                                type="number"
                                aria-label="code"
                                name="code2"
                                placeholder='0'
                                value={formData.code2}
                                onChange={handleChange}
                                inputMode="numeric" // This suggests a numeric keyboard on mobile devices
                                maxLength={1} // Limits the input to 4 characters
                                pattern="[0-9]*" // Allows only numeric characters
                                title="Please enter only numeric characters" // Displayed as a tooltip
                                required
                            />
                            <input
                                className="appearance-none bg-transparent border-b border-black bg-[#fcc4c4] rounded-md shadow-inner w-12 text-center font-bold text-black placeholder:text-gray-900 placeholder:opacity-50 py-4 px-4 leading-tight focus:outline-none"
                                type="number"
                                aria-label="code"
                                placeholder='0'
                                name="code3"
                                value={formData.code3}
                                onChange={handleChange}
                                inputMode="numeric" // This suggests a numeric keyboard on mobile devices
                                maxLength={1} // Limits the input to 4 characters
                                pattern="[0-9]*" // Allows only numeric characters
                                title="Please enter only numeric characters" // Displayed as a tooltip
                                required
                            />
                            <input
                                className="appearance-none bg-transparent border-b border-black bg-[#fcc4c4] rounded-md shadow-inner w-12 text-center font-bold text-black placeholder:text-gray-900 placeholder:opacity-50 py-4 px-4 leading-tight focus:outline-none"
                                type="number"
                                aria-label="code"
                                placeholder='0'
                                name="code4"
                                value={formData.code4}
                                onChange={handleChange}
                                inputMode="numeric" // This suggests a numeric keyboard on mobile devices
                                maxLength={1} // Limits the input to 4 characters
                                pattern="[0-9]*" // Allows only numeric characters
                                title="Please enter only numeric characters" // Displayed as a tooltip
                                required
                            />
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <div className="relative mt-12">
                            <div className="absolute -inset-0">
                                <div
                                    className="w-full h-full max-w-sm mx-auto lg:mx-0 opacity-50 blur-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600">
                                </div>
                            </div>
                            <button
                                className="relative z-10 inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                type='submit'>
                                Enter
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default OtpCode;
