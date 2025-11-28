import { AlertCircle, Activity } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchema";
import type { z } from "zod";
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { loginUser } from '../features/user/userSlice';

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useAppSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    await dispatch(loginUser(data));
    // if (loginUser.fulfilled.match(result)) {
    //   alert("Welcome " + result.payload.name);
    // }
  };

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser.role)
      if (currentUser.role === "chef_parc") {
        navigate("/FleetManagement");
      } else {
        navigate("/home");
      }
    }
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl mb-4 shadow-lg">
            <Activity className="w-10 h-10 text-white animate-spin" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Signing In...</h2>
          <p className="text-gray-600">Please wait while we authenticate you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md ">
        {/* Logo and Title Section */}
        <div className="text-center mb-8 ">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl mb-4 shadow-lg">
            <Activity className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ResQ</h1>
          <p className="text-gray-600 text-lg">Ambulance Dispatching Solution</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button className="text-red-600 hover:text-red-700 font-semibold">
                Contact Administrator
              </button>
            </p>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            For emergency access, contact support at{' '}
            <span className="text-red-600 font-semibold">emergency@resq.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
