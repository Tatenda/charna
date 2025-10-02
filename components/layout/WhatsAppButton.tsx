import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { WHATSAPP_NUMBER } from '@/lib/constants';

const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <a 
      href={whatsappUrl} 
      className="fixed bottom-6 right-6 bg-botanical hover:bg-botanical/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition duration-200 z-50"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
    </a>
  );
};

export default WhatsAppButton;
