import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import SubmitProductPage from './pages/SubmitProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-ink-50">
        <Navbar />

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/launch/:id" element={<ProductDetailPage />} />
            <Route
              path="/submit"
              element={
                <ProtectedRoute>
                  <SubmitProductPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="border-t border-ink-100 bg-white py-6">
          <p className="mx-auto max-w-3xl px-4 text-center text-xs text-ink-400">
            ProductPulse — a MERN portfolio project. Built with React 17, Express,
            and MongoDB.
          </p>
        </footer>

        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          theme="light"
        />
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
