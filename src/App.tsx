// Updated App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";
import { CallToAction } from "./CallToAction";
import { Footer } from "./Footer";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Hero />
                  <About />
                  <Services />
                  <CallToAction />
                  <Footer />
                </>
              }
            />
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}