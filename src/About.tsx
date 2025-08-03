import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Badge } from "./components/ui/badge";
import { CheckCircle, Calendar, Users, Award } from "lucide-react";

export function About() {
  const features = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Expert Planning",
      description: "Meticulous attention to every detail"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Seamless Coordination",
      description: "Flawless execution from start to finish"
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Award-Winning Service",
      description: "Recognized excellence in event management"
    }
  ];

  const benefits = [
    "Full-service event planning",
    "Venue selection and management",
    "Vendor coordination and oversight",
    "On-site event management",
    "Post-event follow-up and analysis"
  ];

  return (
    <section id="about" className="bg-muted/30 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop"
                alt="Professional event coordination team at work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-lg border border-border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Currently Planning 25+ Events</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">About Eunioa</Badge>
              <h2 className="text-3xl md:text-4xl">
                Bringing Your
                <span className="text-primary"> Vision</span> to Life
              </h2>
              <p className="text-lg text-muted-foreground">
                Since 2018, Eunioa has been creating extraordinary events that exceed expectations. 
                We specialize in organizing, hosting, and coordinating memorable experiences that 
                connect people and celebrate life's most important moments.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-card border border-border">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3>Our Comprehensive Services</h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}