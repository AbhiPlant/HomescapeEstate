import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup',
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='p-3 max-w-md mx-auto'>
      <h1 className='text-4xl text-center font-bold text-gray-800 my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='Username' className='border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500' id='username' onChange={handleChange} />
        <input type='email' placeholder='Email' className='border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500' id='email' onChange={handleChange} />
        <input type='password' placeholder='Password' className='border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-blue-500 text-white p-3 rounded-lg uppercase hover:bg-blue-600 disabled:opacity-50' type="submit">
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
  
      <div className="flex items-center justify-center mt-5 text-gray-800">
        <p>Already have an account? </p>
        <Link to="/sign-in" className="text-blue-500 hover:underline">Sign In</Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
  
}


// return (
//   <div className='p-3 max-w-lg mx-auto'>
//     <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
//     <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//       <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
//       <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
//       <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
//       <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign Up'}</button>
//       <OAuth/>
//     </form>

//     <div className="flex gap-2 mt-5">
//       <p>Have an account?</p>
//       <Link to={"/sign-in"}>
//         <span className='text-blue-700'>Sign In</span>
//       </Link>
//     </div>
//     {error && <p className='text-red-500 mt-5'>{error}</p>}
//   </div>
// )