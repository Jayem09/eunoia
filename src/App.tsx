import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";
import { CallToAction } from "./CallToAction";
import { Footer } from "./Footer";
import AdminDashboard from "./components/AdminDashboard";
import { Contact } from "./Contact";

export default function App() {
  return (
    <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Routes>
            {/* Public routes with header/footer */}
            <Route path="/*" element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={
                      <>
                        <Hero />
                        <About />
                        <Services />
                        <CallToAction />
                      </>
                    } />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
            
            {/* Protected admin route */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
    </Router>
  );
}