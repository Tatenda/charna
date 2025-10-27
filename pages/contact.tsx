import { useState, useEffect } from "react";
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
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // Fetch CMS content on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/page-content/contact');
        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            setContent(data.content);
          } else {
            console.error('No content found in CMS');
          }
        } else {
          console.error('Failed to fetch contact page content');
        }
      } catch (error) {
        console.error('Error fetching contact page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

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

  // Show loading state
  if (loading || !content) {
    return (
      <div className="bg-secondary-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral">Loading contact page...</p>
        </div>
      </div>
    );
  }

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
            {content.hero.title}
          </h1>
          <p className="text-white/80 text-center max-w-3xl mx-auto text-lg">
            {content.hero.description}
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
              <h3 className="font-accent text-lg font-semibold mb-2">{content.location.title}</h3>
              <p className="text-neutral">{content.location.city}</p>
              <p className="text-neutral">{content.location.country}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon="envelope" className="text-primary text-xl" />
              </div>
              <h3 className="font-accent text-lg font-semibold mb-2">{content.email.title}</h3>
              <p className="text-neutral mb-2">For general and order queries:</p>
              <a href={`mailto:${content.email.generalEmail}`} className="text-primary hover:text-accent">
                {content.email.generalEmail}
              </a>
              <p className="text-neutral mt-3 mb-2">For wholesale queries:</p>
              <a href={`mailto:${content.email.wholesaleEmail}`} className="text-primary hover:text-accent">
                {content.email.wholesaleEmail}
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon="phone" className="text-primary text-xl" />
              </div>
              <h3 className="font-accent text-lg font-semibold mb-2">{content.phone.title}</h3>
              <p className="text-neutral mb-2">Cell:</p>
              <a href={`tel:${content.phone.cell.replace(/\s/g, '')}`} className="text-primary hover:text-accent">
                {content.phone.cell}
              </a>
              <p className="text-neutral mt-3 mb-2">WhatsApp:</p>
              <a 
                href={`https://wa.me/${content.phone.whatsapp}`} 
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
              <h2 className="font-heading text-2xl font-semibold text-primary mb-6">{content.formHeading}</h2>
              
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
                  {content.workshopHours && content.workshopHours.map((hour: any, index: number) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="font-accent font-medium">{hour.day}</span>
                      <span>{hour.hours}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-heading text-xl font-semibold text-primary mb-4">Visit Our Joburg Workshop</h3>
                  <p className="text-neutral mb-4">
                    {content.workshopDescription}
                  </p>
                  {content.workshopNote && (
                    <p className="text-neutral">
                      <strong>Please note:</strong> {content.workshopNote}
                    </p>
                  )}
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
            {content.faq && content.faq.map((item: any, index: number) => (
              <div key={index} className="bg-secondary rounded-lg p-6">
                <h3 className="font-accent text-lg font-semibold mb-3">{item.question}</h3>
                <p className="text-neutral">
                  {item.answer}
                </p>
              </div>
            ))}
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
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4">{content.socialCTA.heading}</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            {content.socialCTA.description}
          </p>
          <div className="flex justify-center space-x-6">
            {content.socialCTA.socialLinks && content.socialCTA.socialLinks.map((link: any, index: number) => (
              <a 
                key={index}
                href={link.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary hover:bg-secondary transition-colors rounded-full w-12 h-12 flex items-center justify-center"
                aria-label={link.label}
              >
                <FontAwesomeIcon icon={['fab', link.platform as any]} className="text-xl" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
