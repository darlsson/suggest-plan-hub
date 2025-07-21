
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CheckCircle, Users, TrendingUp, Vote, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';
import demoDashboard from '@/assets/demo-dashboard.jpg';
import demoAnalytics from '@/assets/demo-analytics.jpg';
import demoVoting from '@/assets/demo-voting.jpg';

const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Employee Engagement",
      description: "Empower your team to share ideas and participate in decision-making"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Data-Driven Insights",
      description: "Get comprehensive analytics on suggestions and employee participation"
    },
    {
      icon: <Vote className="h-8 w-8 text-primary" />,
      title: "Democratic Voting",
      description: "Let employees vote on suggestions to prioritize the best ideas"
    }
  ];

  const demoImages = [
    { src: demoDashboard, alt: "Dashboard Demo", title: "Suggestion Management Dashboard" },
    { src: demoAnalytics, alt: "Analytics Demo", title: "Comprehensive Analytics" },
    { src: demoVoting, alt: "Voting Demo", title: "Employee Voting System" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/lovable-uploads/29b1b0b1-ba4e-40a4-9f9e-b5ff22a4c332.png" alt="GODA" className="h-8 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Transform Ideas Into Action
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in">
            Empower your team with a comprehensive suggestion and roadmap management platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/login">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20">
              Watch Demo
            </Button>
          </div>
          
          {/* Product Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white backdrop-blur">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-200">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how Estus streamlines suggestion management and empowers data-driven decisions
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {demoImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <h3 className="text-2xl font-semibold mb-2">{image.title}</h3>
                        </div>
                        <div className="aspect-video overflow-hidden rounded-lg">
                          <img 
                            src={image.src} 
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your organization's needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">$0</div>
                <CardDescription>Perfect for small teams getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Up to 50 suggestions per month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Basic analytics dashboard
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Employee voting system
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Email support
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link to="/login">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                Coming Soon
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">$29</div>
                <CardDescription>Advanced features for growing organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Unlimited suggestions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Advanced analytics & reporting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Custom roadmap management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    API access
                  </li>
                </ul>
                <Button className="w-full" disabled>
                  Under Development
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground">
              Ready to transform your organization's idea management? Let's talk!
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <Input
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                  <Textarea
                    placeholder="Tell us about your needs..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-3" />
                    <span>hello@estus.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-3" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-3" />
                    <span>123 Innovation Drive, Tech City, TC 12345</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={(e) => {
      e.preventDefault();
      window.location.href='https://www.linkedin.com/company/goda-ab';
      }} target="blank">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold text-primary mb-4">Estus</h3>
              <p className="text-muted-foreground mb-4">
                Empowering organizations to harness the collective intelligence of their teams 
                through innovative suggestion and roadmap management.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-primary">Features</Link></li>
                <li><Link to="#" className="hover:text-primary">Pricing</Link></li>
                <li><Link to="#" className="hover:text-primary">Demo</Link></li>
                <li><Link to="#" className="hover:text-primary">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-primary">Documentation</Link></li>
                <li><Link to="#" className="hover:text-primary">Help Center</Link></li>
                <li><Link to="#" className="hover:text-primary">Contact</Link></li>
                <li><Link to="#" className="hover:text-primary">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Estus. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground mt-4 sm:mt-0">
              <Link to="#" className="hover:text-primary">Privacy Policy</Link>
              <Link to="#" className="hover:text-primary">Terms of Service</Link>
              <Link to="#" className="hover:text-primary">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
