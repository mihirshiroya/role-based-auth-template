
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Ui/Button';
import { Input } from '../components/Ui/Input';
import { Card } from '../components/Ui/Card';

const profileSchema = Yup.object().shape({
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
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
});

const Profile: React.FC = () => {
  const { user, updateProfile, googleAuthStatus, linkGoogle, unlinkGoogle } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = async (values: any) => {
    updateProfile.mutate(values, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleLinkGoogle = () => {
   console.log("Link Google clicked implement later");
  };

  const handleUnlinkGoogle = () => {
    unlinkGoogle.mutate();
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="mx-auto w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover" />
              ) : (
                <span className="text-primary-600 font-bold text-3xl">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-4 space-y-2">
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.isEmailVerified ? 'Email Verified' : 'Email Unverified'}
              </div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                {user.role}
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <Formik
              initialValues={{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              }}
              validationSchema={profileSchema}
              onSubmit={handleUpdateProfile}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field name="firstName">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          label="First Name"
                          error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                        />
                      )}
                    </Field>

                    <Field name="lastName">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          label="Last Name"
                          error={touched.lastName && errors.lastName ? errors.lastName : undefined}
                        />
                      )}
                    </Field>
                  </div>

                  <Field name="email">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        label="Email Address"
                        error={touched.email && errors.email ? errors.email : undefined}
                        helperText="Changing your email will require re-verification"
                      />
                    )}
                  </Field>

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      loading={isSubmitting || updateProfile.isPending}
                      className='bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium'
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <p className="text-gray-900">{user.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="text-gray-900">{user.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Account Provider</label>
                <p className="text-gray-900">{user.provider}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Integration</h2>
        
        {googleAuthStatus.isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24">
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
              <div>
                <h3 className="font-medium text-gray-900">Google Account</h3>
                <p className="text-sm text-gray-600">
                  {googleAuthStatus.data?.data.isLinked
                    ? 'Your Google account is connected'
                    : 'Connect your Google account for easier sign-in'}
                </p>
              </div>
            </div>
            <div>
              {googleAuthStatus.data?.data.isLinked ? (
                <Button
                  variant="outline"
                  onClick={handleUnlinkGoogle}
                  loading={unlinkGoogle.isPending}
                  disabled={!googleAuthStatus.data.data.canUnlink}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  onClick={handleLinkGoogle}
                  loading={linkGoogle.isPending}
                >
                  Connect Google
                </Button>
              )}
            </div>
          </div>
        )}
        
        {googleAuthStatus.data?.data.isLinked && !googleAuthStatus.data.data.canUnlink && (
          <p className="mt-2 text-sm text-amber-600">
            You cannot disconnect Google as it's your only authentication method. Please set a password first.
          </p>
        )}
      </Card>
    </div>
  );
};

export default Profile;