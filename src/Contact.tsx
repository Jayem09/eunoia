import { Button } from "./components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";

type FormData = {
    name: string;
    email: string;
    message: string;
};

export function Contact() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log(data);
        // Add your form submission logic here
    };

    return (
        <section id="contact" className="bg-background py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                        Get in <span className="text-primary">Touch</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions or ready to start planning your event? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    {...register("name", { required: "Name is required" })}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Your name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    {...register("message", { required: "Message is required" })}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Tell us about your event..."
                                />
                                {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
                            </div>

                            <Button type="submit" size="lg" className="w-full">
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-card rounded-xl shadow-sm p-8 border border-border h-full">
                            <div className="space-y-6">
                                <h3 className="text-xl font-medium text-foreground">Contact Information</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                                            <p className="text-foreground">contact@eunoiaevents.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                                            <p className="text-foreground">+1 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">Office</h4>
                                            <p className="text-foreground">
                                               Lipa City Batangas <br />
                                                Highfive Building
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Business Hours</h4>
                                    <div className="space-y-1">
                                        <p className="text-foreground">Monday - Friday: 9am - 6pm</p>
                                        <p className="text-foreground">Saturday: 10am - 4pm</p>
                                        <p className="text-foreground">Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}