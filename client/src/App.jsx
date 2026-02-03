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

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
