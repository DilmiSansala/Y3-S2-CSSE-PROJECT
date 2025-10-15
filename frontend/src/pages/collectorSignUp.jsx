import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const CollectorSignUp = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3050/api/collector/signup", {
        name,
        phone,
        email,
        password,
        city,
      });
      

      if (res.status === 201) {
        alert("Collector registered successfully!");
        navigate("/collector-signin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error registering collector");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white sm:px-6 lg:px-8'>
      <div className='relative w-full max-w-md p-10 shadow-lg bg-green-50 rounded-2xl'>
        <h2 className='text-3xl font-extrabold text-center text-green-700'>Collector Registration</h2>

        {error && (
          <div className='relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded' role='alert'>
            <strong className='font-bold'>Error: </strong>
            <span className='block sm:inline'>{error}</span>
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4 rounded-md shadow-sm'>
            <div>
              <label htmlFor='name' className='sr-only'>
                Collector Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                required
                className='relative block w-full px-4 py-2 text-green-900 placeholder-gray-400 border border-green-300 appearance-none rounded-xl focus:outline-none focus:ring-green-500 focus:border-green-500'
                placeholder='Collector Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='phone' className='sr-only'>
                Phone Number
              </label>
              <input
                id='phone'
                name='phone'
                type='text'
                required
                className='relative block w-full px-4 py-2 text-green-900 placeholder-gray-400 border border-green-300 appearance-none rounded-xl focus:outline-none focus:ring-green-500 focus:border-green-500'
                placeholder='Phone Number'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='city' className='sr-only'>
                City
              </label>
              <input
                id='city'
                name='city'
                type='text'
                required
                className='relative block w-full px-4 py-2 text-green-900 placeholder-gray-400 border border-green-300 appearance-none rounded-xl focus:outline-none focus:ring-green-500 focus:border-green-500'
                placeholder='City'
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='relative block w-full px-4 py-2 text-green-900 placeholder-gray-400 border border-green-300 appearance-none rounded-xl focus:outline-none focus:ring-green-500 focus:border-green-500'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='relative block w-full px-4 py-2 text-green-900 placeholder-gray-400 border border-green-300 appearance-none rounded-xl focus:outline-none focus:ring-green-500 focus:border-green-500'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className='flex items-center justify-between mt-6'>
            <button
              type='submit'
              className='flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <Link
            to="/collector-signin"
            className="font-bold text-green-600 hover:text-green-800">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollectorSignUp;
