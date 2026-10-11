// FORMATTING & UTILITY HELPERS
export function formatINR(amount) {
  if (amount === 0) return 'Bespoke / Custom Budget';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function hideBrokenImage(e) {
  e.target.style.display = 'none';
}

export function buildOrderMessage(product, customText = '') {
  return `Hi! I would like to order "${product.name}" (${product.price === 0 ? 'Bespoke / Custom Budget' : formatINR(product.price)}). ${customText ? 'Customization details: ' + customText : ''}`;
}

export function whatsappLink(message) {
  return `https://wa.me/919745082273?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject, body) {
  return `mailto:floweraaine@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// STORE METADATA CONFIGURATION
export const STORE = {
  name: 'Floweraaine',
  tagline: 'Pieces made to be remembered.',
  phone: '+91 97450 82273',
  whatsapp: '919745082273',
  email: 'floweraaine@gmail.com',
  location: 'Kerala & Mumbai'
};

// OCCASIONS FOR CUSTOMIZATION
export const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Graduation',
  'Festive / Onam',
  'Valentine\'s Day',
  'Just Because'
];

// SEED REVIEWS
export const seedReviews = [
  {
    id: 'r-1',
    name: 'Aisha M.',
    city: 'Kochi',
    rating: 5,
    title: 'Absolutely stunning work',
    body: 'The Porsche frame exceeded all my expectations. The attention to detail on the license plate and the hand-tied ribbon made it the perfect anniversary gift.',
    product: 'Porsche 911 Frame',
    verified: true
  },
  {
    id: 'r-2',
    name: 'Rahul K.',
    city: 'Trivandrum',
    rating: 5,
    title: 'Best custom hamper ever',
    body: 'I gave them a budget and a theme, and they delivered magic. The unboxing experience is premium from start to finish.',
    product: 'Bespoke Birthday Hamper',
    verified: true
  }
];

// ORIGINAL STUDIO CATALOG
export const products = [
  // --- CARS & FRAMES ---
  {
    id: 'p-1',
    name: 'Porsche 911 Frame',
    price: 3500,
    description: 'A striking 3D shadowbox featuring a die-cast Porsche 911. The backdrop can be personalized with a date, name, or custom message.',
    category: 'customizable',
    type: 'cars',
    features: ['Die-cast model', 'Custom license plate', 'Premium shadowbox'],
    isTrending: true,
    image: '/product-images/porsche.jpg'
  },
  {
    id: 'p-2',
    name: "3D Collector's Frame: Dodge Charger",
    price: 3800,
    description: 'A dark, sleek tribute to American muscle. This shadowbox mounts a detailed 3D die-cast model, perfect for any automotive enthusiast.',
    category: 'customizable',
    type: 'cars',
    features: ['Die-cast Dodge Charger', 'Custom backing', 'Wall-mountable'],
    isTrending: false,
    image: '/product-images/charger-final.jpg'
  },
  {
    id: 'p-3',
    name: 'BMW M4 Collector Frame',
    price: 3500,
    description: 'A pristine display featuring the iconic BMW M4. Hand-mounted and framed for the ultimate desktop or wall display.',
    category: 'customizable',
    type: 'cars',
    features: ['Die-cast BMW M4', 'Minimalist typography', 'Glass front'],
    isTrending: true,
    image: '/product-images/bmw-m4.jpg'
  },
  {
    id: 'p-4',
    name: 'Mahindra Thar Adventure Frame',
    price: 3200,
    description: 'A rugged and beautiful showcase of the classic Thar, set against a customized terrain or personalized backdrop.',
    category: 'customizable',
    type: 'cars',
    features: ['Die-cast Thar', 'Custom adventure theme', 'Premium frame'],
    isTrending: false,
    image: '/product-images/thar-car-frame.jpg'
  },
  {
    id: 'p-5',
    name: 'A4 Classic Custom Frame',
    price: 1500,
    description: 'A beautiful, large-format A4 frame ready to be personalized with your photographs, quotes, or special dates.',
    category: 'customizable',
    type: 'cars',
    features: ['A4 dimensions', 'High-quality print', 'Ready to hang'],
    isTrending: false,
    image: '/product-images/a4-customized-frame.jpg'
  },
  {
    id: 'p-6',
    name: 'Mini 4x4 Keepsake Frame',
    price: 999,
    description: 'A compact, elegant 4x4 inch frame perfect for desks, nightstands, and small memory keepsakes.',
    category: 'customizable',
    type: 'cars',
    features: ['4x4 dimensions', 'Easel back', 'Matte finish'],
    isTrending: false,
    image: '/product-images/4x4-frame.jpg'
  },

  // --- LUXURY HAMPERS ---
  {
    id: 'p-7',
    name: 'Bespoke Birthday Hamper',
    price: 0, 
    description: 'Tell us the person, the occasion, and your budget. We will sketch and craft a customized birthday hamper specifically around them.',
    category: 'customizable',
    type: 'hampers',
    features: ['Budget-based curation', 'Personalized items', 'Premium unboxing'],
    isTrending: true,
    image: '/product-images/custom-birthday-hamper.jpg'
  },
  {
    id: 'p-8',
    name: 'Festive Onam Hamper',
    price: 0,
    description: 'A beautifully curated traditional hamper featuring authentic Kerala treats, cultural keepsakes, and personalized festive greetings.',
    category: 'customizable',
    type: 'hampers',
    features: ['Traditional curation', 'Festive packaging', 'Custom notes'],
    isTrending: false,
    image: '/product-images/onam-hamper.jpg'
  },
  {
    id: 'p-9',
    name: 'Luxury Trolley Hamper',
    price: 0,
    description: 'Our most extravagant gifting option. A customized multi-tier trolley filled with hand-selected luxury goods and floral arrangements.',
    category: 'customizable',
    type: 'hampers',
    features: ['Multi-tier trolley', 'Extravagant curation', 'Floral integration'],
    isTrending: true,
    image: '/product-images/trolly-hamper.jpg'
  },
  {
    id: 'p-10',
    name: 'Ultimate Defender Hamper',
    price: 0,
    description: 'A massive bespoke hamper featuring a centerpiece Defender car frame surrounded by personalized gifts and artisan treats.',
    category: 'customizable',
    type: 'hampers',
    features: ['Centerpiece frame included', 'Bespoke gifts', 'Large format box'],
    isTrending: false,
    image: '/product-images/defender-final.jpg'
  },

  // --- ARTISAN FLORALS ---
  {
    id: 'p-11',
    name: 'Scented Pastel Bouquet',
    price: 1200,
    description: 'Six handcrafted, intricately designed scented flowers arranged in a beautiful pastel bouquet. Lasts forever.',
    category: 'ready',
    type: 'floral',
    features: ['6 handmade flowers', 'Scent-infused', 'Premium wrapping'],
    isTrending: false,
    image: '/product-images/pastel-final.jpg'
  },
  {
    id: 'p-12',
    name: 'Classic Red Rose Bouquet',
    price: 1200,
    description: 'Six deeply colored, handcrafted red roses infused with premium scents, tied with our signature ribbon.',
    category: 'ready',
    type: 'floral',
    features: ['6 red flowers', 'Scent-infused', 'Signature ribbon'],
    isTrending: true,
    image: '/product-images/scented-flower-bouquet-red-6.jpg'
  },
  {
    id: 'p-13',
    name: 'Double Scented Bouquet Set',
    price: 2200,
    description: 'A magnificent double arrangement featuring 12 total handcrafted scented flowers in a lavish presentation.',
    category: 'ready',
    type: 'floral',
    features: ['12 handmade flowers', 'Dual arrangement', 'Extravagant presentation'],
    isTrending: false,
    image: '/product-images/double-final.jpg'
  }
];