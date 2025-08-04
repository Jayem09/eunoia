import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Separator } from "./components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";

import { subscribeEmail } from "./lib/subscribeEmail"; // your firestore helper

export function Footer() {
  const footerLinks = {
    Services: [
      { name: "Corporate Events", href: "#" },
      { name: "Weddings", href: "#" },
      { name: "Social Events", href: "#" },
      { name: "Special Occasions", href: "#" },
      { name: "Event Consultation", href: "#" }
    ],
    Company: [
      { name: "About Eunioa", href: "#about" },
      { name: "Our Team", href: "#" },
      { name: "Portfolio", href: "#" },
      { name: "Testimonials", href: "#" },
      { name: "Contact", href: "#contact" }
    ],
    Resources: [
      { name: "Event Planning Guide", href: "#" },
      { name: "Venue Directory", href: "#" },
      { name: "Budget Calculator", href: "#" },
      { name: "Event Timeline", href: "#" },
      { name: "Vendor Network", href: "#" }
    ],
    Support: [
      { name: "Help Center", href: "#" },
      { name: "Event Inquiry", href: "#" },
      { name: "Emergency Contact", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" }
  ];

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubscribe = async () => {
    if (!emailRegex.test(email)) {
      showStatus("Enter a valid email address.");
      return;
    }

    setLoading(true);
    const result = await subscribeEmail(email);
    setLoading(false);

    if (result.success) {
      showStatus("Subscribed! Thanks!");
      setEmail("");
    } else {
      showStatus("Subscription failed. Try again.");
    }
  };

  const showStatus = (msg: string) => {
    setVisible(false);
    setTimeout(() => {
      setStatus(msg);
      setVisible(true);
    }, 100);
  };

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl">Stay Connected with Eunioa</h3>
              <p className="text-muted-foreground">
                Get event planning tips, inspiration, and exclusive updates delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={loading}
              />
              <Button onClick={handleSubscribe} disabled={loading} className="whitespace-nowrap">
                <Mail className="mr-2 h-4 w-4" />
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>

            {/* Animated Status */}
            <div className="relative h-6 mt-2 lg:col-span-2">
              <p
                className={`text-sm text-muted-foreground absolute transition-all duration-500 ease-in-out
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
                style={{ willChange: "opacity, transform" }}
              >
                {status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">E</span>
                </div>
                <span className="ml-2 text-xl font-medium">Eunioa</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Creating extraordinary events that connect people and celebrate life's
                most important moments. From intimate gatherings to grand celebrations,
                we organize, host, and coordinate with precision and passion.
              </p>
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="font-medium">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2025 Eunioa Event Organizers. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Emergency Contact
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Event Insurance
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
