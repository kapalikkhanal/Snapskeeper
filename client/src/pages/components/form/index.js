import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router'

function ContactForm() {
    const router = useRouter()
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Set loading to true while waiting for the server response
            setLoading(true);

            // Send form data to the backend
            const response = await axios.post('https://indecisive-elite-maple.glitch.me//submit', formData);

            console.log(response.data);

            // Set loading to false after successful submission
            setLoading(false);
            setSuccess(true);

            // Reset form data after successful submission
            setFormData({
                name: '',
                phone: '',
                email: '',
            });

            // Reload the page if needed
            // window.location.reload();
        } catch (error) {
            console.error('Error submitting form:', error.message);
            // Set loading to false after an error
            setLoading(false);
            setSuccess(false);
        }
    };


    if (success) {
        const alertMessage = success ? 'Email sent successfully!' : 'Error sending email. Please try again.';
        toast({
            title: alertMessage,
            status: success ? 'success' : 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
    }

    return (
        <div>
            <div>
                <div>
                    <h1 className='text-black font-medium text-3xl text-center p-5 mt-8 m-2'>
                        Fill in the details, and we will send detailed information to your email.
                    </h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='flex justify-center'>
                        <div className='flex flex-col w-48 items-center border-b border-black shadow-2xl py-2'>
                            <label className='text-black font-medium text-center' htmlFor="name">Name</label>
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-800 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="text"
                                placeholder="John Doe"
                                aria-label="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <br />
                    <div className='flex justify-center'>
                        <div className='flex flex-col w-48 items-center border-b border-black shadow-2xl py-2'>
                            <label className='text-black font-medium text-center' htmlFor="phone">Phone</label>
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-800 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="tel"
                                placeholder="9812345678"
                                aria-label="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <br />
                    <div className='flex justify-center'>
                        <div className='flex flex-col w-48 items-center border-b border-black shadow-2xl py-2'>
                            <label className='text-black font-medium text-center' htmlFor="email">Email</label>
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-800 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="text"
                                placeholder="Enter your email"
                                aria-label="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <br />
                    <div>
                        {
                            (success) && (
                                <h1 className='text-green-900 text-center'>Email sent successfully.</h1>
                            )
                        }

                    </div>
                    <div className='flex justify-center'>
                        <div>
                            <button
                                className='bg-black text-white p-4 mt-10 rounded-2xl w-40 mb-24'
                                type="submit"
                                disabled={loading} // Disable the button while loading
                            >
                                {loading ? 'Sending...' : 'Send Mail'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <footer
                className="bg-gray-900 text-lg text-white text-center fixed 
             inset-x-0 
             bottom-0 
             p-4
             font-bold">
                Go back to
                <button onClick={() => { router.push('/uploadImage') }} className='text-gray-200 p-1 m-2 bg-blue-900 rounded-2xl'>&nbsp;Upload photos.&nbsp;</button>
            </footer>
        </div>
    );
}

export default ContactForm;