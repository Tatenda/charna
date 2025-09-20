import { useState } from "react";
import Seo from "@/components/layout/Seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { WHATSAPP_NUMBER, SA_PROVINCES } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email address is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  subject: z.string().min(2, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message is too short (minimum 10 characters)" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Submit contact form
      await apiRequest("POST", "/api/contact", values);
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly via WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary-light">
      <Seo 
        title="Contact Us | Charna Leather Bags - Get in Touch"
        description="Contact Charna's team in Johannesburg for questions about our handcrafted leather bags. Visit our workshop, call us, or send a message. We're here to help with product inquiries and custom orders."
        keywords="contact Charna, Johannesburg leather workshop, leather bag inquiries, custom leather bags, Charna customer service"
        image="/images/tennis-bag-lifestyle.jpg"
        url="/contact"
      />
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-4">
            Contact Us
          </h1>
          <p className="text-white/80 text-center max-w-3xl mx-auto text-lg">
            We'd love to hear from you. Get in touch with our team for any questions or inquiries.
          </p>
        </div>
      </div>
      
      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon="map-marker-alt" className="text-primary text-xl" />
              </div>
              <h3 className="font-accent text-lg font-semibold mb-2">Visit Our Workshop</h3>
              <p className="text-neutral">Johannesburg</p>
              <p className="text-neutral">South Africa</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon="envelope" className="text-primary text-xl" />
              </div>
              <h3 className="font-accent text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-neutral mb-2">For general and order queries:</p>
              <a href="mailto:info@charna.co.com" className="text-primary hover:text-accent">
                info@charna.co.com
              </a>
              <p className="text-neutral mt-3 mb-2">For wholesale queries:</p>
              <a href="mailto:wholesale@charna.co" className="text-primary hover:text-accent">
                wholesale@charna.co
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon="phone" className="text-primary text-xl" />
              </div>
              <h3 className="font-accent text-lg font-semibold mb-2">Call or Chat</h3>
              <p className="text-neutral mb-2">Cell:</p>
              <a href="tel:0723560321" className="text-primary hover:text-accent">
                072 356 0321
              </a>
              <p className="text-neutral mt-3 mb-2">WhatsApp:</p>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                className="bg-green-600 hover:bg-green-700 text-white font-accent text-sm py-2 px-4 rounded inline-flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={['fab', 'whatsapp']} className="mr-2" /> Chat on WhatsApp
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="font-heading text-2xl font-semibold text-primary mb-6">Send Us a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+27 12 345 6789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Product inquiry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="I'm interested in learning more about your products..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="btn-primary w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon="spinner" className="animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
            
            {/* Map and Hours */}
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="aspect-w-16 aspect-h-9 h-80">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463520.0337897676!2d27.8546491!3d-26.2041028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95152284fde5fb%3A0xc73a616c34f99c5f!2sGreater%20Johannesburg%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1691426821500!5m2!1sen!2sus" 
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Charna Workshop Location - Greater Johannesburg"
                  ></iframe>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-heading text-xl font-semibold text-primary mb-4">Workshop Hours</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span className="font-accent font-medium">Monday - Friday</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-accent font-medium">Saturday</span>
                    <span>10:00 AM - 3:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-accent font-medium">Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-heading text-xl font-semibold text-primary mb-4">Visit Our Joburg Workshop</h3>
                  <p className="text-neutral mb-4">
                    We welcome visitors to our workshop in Johannesburg. See our craftspeople at work 
                    and experience our products firsthand.
                  </p>
                  <p className="text-neutral">
                    <strong>Please note:</strong> Workshop visits are by appointment only. 
                    Contact us to schedule your visit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-semibold text-primary">Frequently Asked Questions</h2>
            <div className="divider mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="font-accent text-lg font-semibold mb-3">Do you ship internationally?</h3>
              <p className="text-neutral">
                Yes, we ship to select international destinations. Please contact us for shipping rates and estimated delivery times.
              </p>
            </div>
            
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="font-accent text-lg font-semibold mb-3">What is your return policy?</h3>
              <p className="text-neutral">
                We accept returns within 14 days of delivery for items in their original condition. Custom orders are non-returnable.
              </p>
            </div>
            
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="font-accent text-lg font-semibold mb-3">How do I care for my leather bag?</h3>
              <p className="text-neutral">
                We recommend regular cleaning with a soft cloth and occasional conditioning with leather cream. Keep away from direct sunlight and moisture.
              </p>
            </div>
            
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="font-accent text-lg font-semibold mb-3">Do you offer wholesale options?</h3>
              <p className="text-neutral">
                Yes, we offer wholesale partnerships with select retailers. Please contact our wholesale department for more information.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-neutral">
              Can't find what you're looking for? <a href="#contact-form" className="text-primary hover:text-accent">Contact us</a> directly.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4">Connect With Us on Social Media</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Follow our journey, see behind-the-scenes content, and be the first to know about new products and promotions.
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.instagram.com/charna.co?igsh=MXBscWkyNjQybWI2Mw%3D%3D&utm_source=qr" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary hover:bg-secondary transition-colors rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={['fab', 'instagram']} className="text-xl" />
            </a>
            <a 
              href="https://facebook.com/livinggreenmovement" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary hover:bg-secondary transition-colors rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={['fab', 'facebook-f']} className="text-xl" />
            </a>
            <a 
              href="https://pinterest.com/livinggreenmovement" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary hover:bg-secondary transition-colors rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Pinterest"
            >
              <FontAwesomeIcon icon={['fab', 'pinterest-p']} className="text-xl" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
