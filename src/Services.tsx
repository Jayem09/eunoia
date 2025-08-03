import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Building2, Heart, Users, PartyPopper, Calendar, Headphones } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

export function Services() {
  const services = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Corporate Events",
      description: "Professional conferences, meetings, and corporate celebrations",
      features: ["Product Launches", "Team Building", "Board Meetings", "Annual Galas"],
      popular: true
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Weddings",
      description: "Romantic ceremonies and receptions tailored to your love story",
      features: ["Ceremony Planning", "Reception Coordination", "Vendor Management", "Day-of Coordination"],
      popular: false
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Social Events",
      description: "Birthday parties, anniversaries, and milestone celebrations",
      features: ["Birthday Parties", "Anniversaries", "Graduations", "Family Reunions"],
      popular: false
    },
    {
      icon: <PartyPopper className="h-6 w-6" />,
      title: "Special Occasions",
      description: "Unique celebrations and themed events that create lasting memories",
      features: ["Holiday Parties", "Themed Events", "Fundraisers", "Community Events"],
      popular: false
    }
  ];

  const features = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Full Event Management",
      description: "From concept to cleanup, we handle every detail"
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: "24/7 Support",
      description: "Dedicated event coordinators available around the clock"
    }
  ];

  return (
    <section id="services" className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="w-fit mx-auto">Our Services</Badge>
          <h2 className="text-3xl md:text-4xl">
            Complete Event Solutions for
            <span className="text-primary"> Every Occasion</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you're planning an intimate gathering or a large-scale celebration, 
            our expert team provides comprehensive event organizing, hosting, and coordination services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-shadow">
              {service.popular && (
                <Badge className="absolute -top-2 left-4 z-10">Most Popular</Badge>
              )}
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {service.icon}
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl">
                Why Choose Eunioa for
                <span className="text-primary"> Your Next Event</span>
              </h3>
              <p className="text-lg text-muted-foreground">
                Our experienced team of event professionals brings creativity, precision, 
                and passion to every project. We handle the logistics so you can focus 
                on enjoying your special moment.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=600&fit=crop"
                alt="Beautifully decorated event venue"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="text-sm font-medium">500+ Events</div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="text-sm font-medium">Expert Planning</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}