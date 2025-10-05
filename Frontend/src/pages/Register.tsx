
import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Button } from '../components/Ui/Button';
import { Input } from '../components/Ui/Input';
import { useAppDispatch } from '../hooks/redux';
import { registerUser } from '../store/slices/authSlice';
import { setCredentials } from "../store/slices/authSlice";

const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')
    .required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
   const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword, ...registerData } = values;
      const result = await dispatch(registerUser(registerData));
      if (registerUser.fulfilled.match(result)) {
        toast.success('Registration successful! Please check your email for verification.');
        navigate('/dashboard');
      } else {
        toast.error(result.payload as string);
      }
    } catch (error) {
      toast.error('Registration failed');
    }
  };


   const handleGoogleLogin2 = () => {
      if (googleLoading) return;
      setGoogleLoading(true);
  
      const popup = window.open(
        "http://localhost:5000/api/auth/google",
        "Google Login",
        "width=500,height=600"
      );
  
      if (!popup) return console.error("Popup blocked!");
  
      const channel = new BroadcastChannel("oauth_channel");
  
      channel.onmessage = (event) => {
        console.log("Message from popup:", event.data);
  
        if (event.data.type === "OAUTH_SUCCESS") {
          dispatch(
            setCredentials({
              user: event.data.user,
            })
          );
  
          if (popup && !popup.closed) popup.close();
          navigate("/dashboard");
  
          channel.close();
        }
  
        if (event.data.type === "OAUTH_ERROR") {
          console.error("OAuth failed:", event.data.error);
          if (popup && !popup.closed) popup.close();
          channel.close();
        }
       
          if (popup.closed) {
            setGoogleLoading(false);
            channel.close();
          }
  
      };
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field name="firstName">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        type="text"
                        label="First Name"
                        placeholder="Enter your first name"
                        error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                      />
                    )}
                  </Field>

                  <Field name="lastName">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        type="text"
                        label="Last Name"
                        placeholder="Enter your last name"
                        error={touched.lastName && errors.lastName ? errors.lastName : undefined}
                      />
                    )}
                  </Field>
                </div>

                <Field name="email">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      type="email"
                      label="Email address"
                      placeholder="Enter your email"
                      error={touched.email && errors.email ? errors.email : undefined}
                    />
                  )}
                </Field>

                <Field name="password">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      type="password"
                      label="Password"
                      placeholder="Enter your password"
                      error={touched.password && errors.password ? errors.password : undefined}
                      helperText="Must contain uppercase, lowercase, number and special character"
                    />
                  )}
                </Field>

                <Field name="confirmPassword">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      type="password"
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                    />
                  )}
                </Field>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Create Account
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin2}
                className="w-full"
                loading={googleLoading}
                disabled={googleLoading}
              >
               {googleLoading ? (
                  "Signing up..."
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;