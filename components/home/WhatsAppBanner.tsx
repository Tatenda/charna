import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WHATSAPP_NUMBER } from '@/lib/constants';

const WhatsAppBanner = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <section className="py-10 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="font-accent text-xl font-semibold text-primary mb-2">Questions about our products?</h3>
            <p className="text-neutral">Chat with us directly on WhatsApp for quick assistance.</p>
          </div>
          <a 
            href={whatsappUrl} 
            className="bg-botanical hover:bg-botanical/90 text-white font-accent font-medium py-3 px-6 rounded-md text-sm uppercase tracking-wider transition duration-200 flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={['fab', 'whatsapp']} className="text-xl mr-2" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppBanner;
