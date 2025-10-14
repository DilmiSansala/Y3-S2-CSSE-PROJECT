import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { CollectorContext } from "../context/collectorContext";
import { jwtDecode } from "jwt-decode";

function CollectorSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(CollectorContext); // Use login method from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3050/api/collector/signin", {
        email,
        password,
      });

      if (res.status === 200) {
        const token = res.data.token;
        const decodedToken = jwtDecode(token); // Decode the JWT token
        const collectorId = decodedToken.id; // Extract the collector ID from the token (assuming it's stored as `id`)

        const user = {
          name: res.data.name,
          token: token,
          collectorId: collectorId,
        };

        // Save the token and collector ID in localStorage
        localStorage.setItem("authToken", user.token);
        localStorage.setItem("collectorId", user.collectorId); // Store collectorId from decoded token
        localStorage.setItem("collectorUser", JSON.stringify(user));

        console.log("Stored collectorId:", localStorage.getItem("collectorId"));
        // Use login method from context
        login(user);

        alert("Signed in successfully!");

        // Redirect to the collector's dashboard or home page
        navigate("/collector/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error signing in");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white sm:px-6 lg:px-8'>
      <div className='relative w-full max-w-md p-10 shadow-lg bg-green-50 rounded-2xl'>
        <h2 className='text-3xl font-extrabold text-center text-green-700'>Collector Sign In</h2>

        {error && (
          <div className='relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded' role='alert'>
            <strong className='font-bold'>Error: </strong>
            <span className='block sm:inline'>{error}</span>
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4 rounded-md shadow-sm'>
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
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Not a collector?</p>
          <Link
            to="/collector-signup"
            className="font-bold text-green-600 hover:text-green-800">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CollectorSignin;
