import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import { store,persistor } from './store';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Security from './pages/Security';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import AuthSuccess from './pages/AuthSuccess';
import AdminDashboard from './pages/AdminDashboard';
import UsersManagement from './pages/UsersManagement';
import UserDetail from './pages/UserDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
  
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            

          
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
             <Route
              path="/auth/success"
              element={
                <ProtectedRoute requireAuth={false}>
                  <AuthSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute requireAuth={false}>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />


            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/security"
              element={
                <ProtectedRoute>
                  <Security />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-email"
              element={
              
                  <VerifyEmail />
              
              }
            />

                 <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UsersManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <AdminRoute>
                  <UserDetail />
                </AdminRoute>
              }
            />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};
const App: React.FC = () => {
  return (
    <Provider store={store}>
           <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
       
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <ReactQueryDevtools initialIsOpen={false} />
    
      </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;