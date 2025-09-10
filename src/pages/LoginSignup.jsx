import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedContext } from '../context/MedContext';
import { Eye, EyeClosed } from 'lucide-react';
import { userLogin } from '../Services/auth';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useContext(MedContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await userLogin(loginCredentials);

      if (result.success) {
        login();
        navigate('/');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black relative flex-col gap-3">
      {/* Background Image - full screen */}
      <div className="absolute inset-0 z-0">
        <img
          src="/login-bg.jpg"
          alt="Login Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Form container - centered with fixed height and scrollable content */}
      <div className="relative z-10 w-full max-w-lg mx-auto my-auto bg-[#FFFFFFF0] rounded-xl p-8 min-h-[85vh] max-h-[85vh] flex flex-col">
        {/* Logo container */}
        <div className="flex flex-col justify-center items-center">
          <img
            src="/Ayra.svg"
            alt="Ayra Logo"
            className="w-40"
          />
          {/* Version info */}
          <div className="text-center text-[10px] text-gray-500 mb-8">
            v1.10 | 2025
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-grow overflow-y-auto flex flex-col justify-center">
          <form onSubmit={handleLoginSubmit} className="space-y-8 p-10">
            
            <div>
              <div className="text-xs text-gray-500 mb-3">Enter Email ID</div>
              <input
                type="email"
                name="email"
                placeholder="Enter Email ID"
                className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                value={loginCredentials.email}
                onChange={handleLoginChange}
              />
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-3">Password</div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  value={loginCredentials.password}
                  onChange={handleLoginChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer outside the white box */}
      <div className="text-center text-xs text-gray-300">
        ©2025. Ayra is a product of Inquantic Technologies Pvt. Ltd. All Rights Reserved
      </div>
    </div>
  );
};

export default LoginSignup;