import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import HowItWorks from './components/HowItWorks';
import WasteAvoided from './components/WasteAvoided';
import WhoIsFor from './components/WhoIsFor';
import Impact from './components/Impact';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Donate from './pages/Donate';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';

// Landing Page Component
const Home = () => (
  <>
    <Hero />
    <ProblemSection />
    <HowItWorks />
    <WasteAvoided />
    <WhoIsFor />
    <Impact />
    <CTA />
  </>
);

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/donor-dashboard" element={<DonorDashboard />} />
            <Route path="/ngo-dashboard" element={<NGODashboard />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
