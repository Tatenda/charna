import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WhatsAppButton = () => {
  const whatsappNumber = "27123456789"; // Replace with actual WhatsApp number
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a 
      href={whatsappUrl} 
      className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition duration-200 z-50"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FontAwesomeIcon icon={['fab', 'whatsapp']} className="text-2xl" />
    </a>
  );
};

export default WhatsAppButton;
