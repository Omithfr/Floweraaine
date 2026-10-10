/* =========================================================================
   STORE DETAILS & CONFIGURATION
   ========================================================================= */
export const STORE = {
  name: 'Floweraaine',
  upiId: '7306238385@fam', 
  whatsappNumber: '919745082273', 
  whatsappDisplay: '+91 97450 82273', 
  email: 'floweraaine@gmail.com',
  hours: 'Mon – Sat, 10am – 8pm IST',
  city: 'Handcrafted in India · Kerala Delivery Only',
  adminPassword: 'admin',
};

export const HERO_IMAGE = '/product images/bmw-hamper.jpg';

export const OCCASIONS = ['Birthday', 'Anniversary', 'Proposal', 'Graduation', 'Just Because'];

/* =========================================================================
   PRODUCT CATALOG (Merged Original + Phase 2.5 + Types)
   ========================================================================= */
export const products = [
  // --- ORIGINAL DISCLOSED PRICE PRODUCTS ---
  { id: 0, name: 'Test Payment (1 Rs)', price: 1, image: '/product images/4x4-frame.jpg', description: 'A 1 Rupee placeholder item to safely test the UPI checkout and UTR verification flow.', features: ['Live Payment Test', '1 INR Transaction', 'Instant Verification'], category: 'standard', type: 'hampers', isTrending: false },
  { id: 1, name: 'BMW M4 Hamper Box', price: 2000, image: '/product images/bmw-hamper.jpg', description: 'A premium gifting experience featuring a detailed BMW M4 model, presented in a luxury box with scented blue roses.', features: ['Includes Car Model', 'Scented Roses', 'Luxury Gift Box'], category: 'customizable', type: 'cars', isTrending: true },
  { id: 2, name: 'BMW M4 Diecast Model', price: 1580, image: '/product images/bmw-m4.jpg', description: 'Highly detailed interactive model. Available in Blue, Black, and Red.', features: ['2-Door, Bonnet & Dickey Opening', 'Horn & Sound Effects', 'Headlight Blinking'], category: 'standard', type: 'cars', isTrending: false },
  { id: 3, name: 'Porsche 911 Frame', price: 730, image: '/product images/porsche.jpg', description: 'Classic Porsche model beautifully mounted on a customized display frame.', features: ['2-Door Opening Feature', 'Detailed Interior', 'Display Frame Included'], category: 'standard', type: 'cars', isTrending: true },
  { id: 4, name: 'Trolly Hamper', price: 2500, image: '/product images/trolly-hamper.jpg', images: ['/product images/trolly-hamper.jpg', '/product images/trolly-hamper(opened).jpg'], description: 'A unique mini-trolley suitcase packed with chocolates, personal photos, and premium gifts.', features: ['Mini Trolley Case', 'Custom Photos', 'Assorted Chocolates'], category: 'customizable', type: 'hampers', isTrending: false },
  { id: 5, name: 'Customized Hampers', price: 1499, image: '/product images/custom-hamper1.jpg', description: 'Tailor-made gift hampers for birthdays, anniversaries, and special occasions.', features: ['Custom Chocolates', 'Personalized Messages', 'Elegant Packaging'], category: 'customizable', type: 'hampers', isTrending: true },
  { id: 6, name: '4 x 4 Photo Frame', price: 160, image: '/product images/4x4-frame.jpg', description: 'A minimalist 4x4 inch frame perfect for showcasing your favorite memories.', features: ['4x4 Inch Size', 'Premium White Finish', 'Ready to Gift'], category: 'standard', type: 'cars', isTrending: false },

  // --- NEW UNDISCLOSED PRICE PRODUCTS (price: 0 -> Rendered as ₹0000) ---
  { id: 7, name: 'The Azure Marble Hamper', price: 0, category: 'customizable', type: 'hampers', image: '/product images/Custom Birthday Hamper.jpg', images: ['/product images/Custom Birthday Hamper.jpg', '/product images/Custom Birthday Hamper(opened).jpg'], description: 'Housed in a stunning azure marble-patterned keepsake box. This hamper opens to reveal premium chocolates alongside a row of everlasting white roses.', features: ['Azure marble magnetic box', 'Curated premium chocolates', 'Everlasting white soap roses'], isTrending: true },
  { id: 8, name: 'Pearlescent BMW Collector\'s Set', price: 0, category: 'customizable', type: 'cars', image: '/product images/BMW car.jpg', description: 'A highly detailed, pearlescent color-shifting die-cast BMW M4 with opening doors and trunk, presented alongside a striking metallic red gift box.', features: ['Color-shifting pearlescent finish', 'Detailed die-cast BMW M4 model', 'Metallic red artisan gift packaging'], isTrending: false },
  { id: 9, name: 'The Explorer\'s Defender Hamper', price: 0, category: 'customizable', type: 'cars', image: '/product images/Custom Hamper with Defeder Car Frame.jpg', description: 'Features a striking 3D Land Rover Defender shadowbox frame paired beautifully with a vibrant bouquet of everlasting red roses.', features: ['3D die-cast Defender shadowbox', 'Red everlasting rose bouquet', 'Premium matte black magnetic box'], isTrending: false },
  { id: 10, name: 'The Midnight Gentleman\'s Hamper', price: 0, category: 'customizable', type: 'hampers', image: '/product images/Custom Birthday Giftable (2).jpg', description: 'A sophisticated matte black gifting experience curated exclusively for him. Features a premium wristwatch, tailored deep blue shirt, and everlasting roses.', features: ['Premium analog wristwatch', 'Tailored apparel piece', 'Matte black keepsake box'], isTrending: false },
  { id: 11, name: 'The Transparent Memory Tote', price: 0, category: 'customizable', type: 'hampers', image: '/product images/Custom Birthday Giftable.jpg', description: 'A modern, clear acrylic gifting tote designed to showcase your favorite memories alongside elegant white soap roses.', features: ['Custom photo frame', 'Clear acrylic tote with gold handles', 'Pristine white everlasting roses'], isTrending: false },
  { id: 12, name: '3D Collector\'s Frame: Dodge Charger R/T', price: 0, category: 'standard', type: 'cars', image: '/product images/Dodge Charger Car.jpg', description: 'A dark, sleek tribute to American muscle. This shadowbox mounts a detailed 3D die-cast model of the classic Dodge Charger R/T.', features: ['Die-cast black Dodge Charger model', 'Minimalist metallic spec-sheet backdrop', 'Premium shadowbox frame'], isTrending: false },
  { id: 13, name: 'Bespoke A4 Automobile Poster', price: 0, category: 'customizable', type: 'cars', image: '/product images/A4 Customized Frame.jpg', description: 'A sleek, minimalist A4 framed print showcasing high-performance automotive art. Completely customizable with your favorite vehicle model.', features: ['Premium A4 glass frame', 'Custom vehicle artwork', 'Personalized dynamic spec sheet'], isTrending: false },
  { id: 14, name: 'Artisan Scented Rose Bouquets (Set)', price: 0, category: 'standard', type: 'floral', image: '/product images/2 Scented Flower Bouquets (6x2 Flowers)..jpg', description: 'A delicate and timeless paired arrangement of everlasting scented soap roses wrapped in sheer tulle.', features: ['Two everlasting scented bouquets', 'Pearl-lined sheer tulle wrap', 'Elegant satin ribbon finish'], isTrending: false },
  { id: 15, name: 'Onam Hamper', price: 0, category: 'customizable', type: 'hampers', image: '/product images/Custom Jewellry.jpg', description: 'A beautifully curated ethnic hamper perfect for Onam and other traditional celebrations. Features elegant golden floral fabric and traditional accessories.', features: ['Traditional festive curation', 'Rich golden floral fabric', 'Customizable contents'], isTrending: false },
  { id: 16, name: 'Blush Pink Artisan Bouquet', price: 0, category: 'standard', type: 'floral', image: '/product images/Scented Flower Bouquet (6 Flowers).jpg', description: 'A delicate arrangement of six everlasting blush pink soap roses. Intricately wrapped in pleated sheer tulle and lined with elegant pearl detailing.', features: ['6 everlasting blush soap roses', 'Pearl-lined tulle wrap', 'Satin ribbon finish'], isTrending: false },
  { id: 17, name: 'Crimson Red Artisan Bouquet', price: 0, category: 'standard', type: 'floral', image: '/product images/Scented Flower Bouquet red(6 Flowers).jpg', description: 'A bold, romantic arrangement of six everlasting crimson red soap roses. Elegantly wrapped in premium frosted paper with gold-leaf borders.', features: ['6 everlasting red soap roses', 'Gold-bordered frosted wrap', 'Rich red satin ribbon'], isTrending: false },
  { id: 18, name: 'Thar Car Frame', price: 730, category: 'customizable', type: 'cars', image: '/product images/Thar Car Frame.jpg', description: 'A striking homage to off-road heritage. Features a beautifully customized display frame mounting a 3D die-cast black Mahindra Thar model.', features: ['3D die-cast Thar model', 'Customizable frame details', 'Perfect off-roader keepsake'], isTrending: false }
];

/* =========================================================================
   SEED REVIEWS
   ========================================================================= */
export const seedReviews = [
  { id: 'r1', name: 'Ananya R.', city: 'Kochi, Kerala', rating: 5, title: 'He opened it twice just to smell the roses', body: 'The BMW hamper was beyond what the photos promised. Every detail felt considered — the ribbon, the card, even the way the roses were arranged around the model.', product: 'BMW M4 Hamper Box', verified: true },
  { id: 'r2', name: 'Karthik S.', city: 'Calicut, Kerala', rating: 5, title: 'A keepsake, not a gift', body: 'Ordered the trolly hamper with our photos for my parents’ anniversary. Mum cried. Payment via UPI was effortless and the team kept me updated on WhatsApp.', product: 'Trolly Hamper', verified: true },
  { id: 'r3', name: 'Meera P.', city: 'Trivandrum, Kerala', rating: 4, title: 'Beautifully finished frame', body: 'The Porsche frame now sits on my partner’s desk. The interior detail is lovely. Delivery was prompt across Kerala.', product: 'Porsche 911 Frame', verified: true },
  { id: 'r4', name: 'Rohan D.', city: 'Thrissur, Kerala', rating: 5, title: 'They took my vague idea and made it perfect', body: 'I only knew I wanted dark chocolates and a handwritten note. The custom hamper they composed felt genuinely personal.', product: 'Customized Hampers', verified: true },
];

/* =========================================================================
   HELPER UTILITIES
   ========================================================================= */
export const formatINR = (value) => {
  if (value === 0) return '₹0000'; // Show 0000 for undisclosed prices
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

export const whatsappLink = (message) => `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
export const mailtoLink = (subject, body) => `mailto:${STORE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export function buildOrderMessage(product, quantity, c) {
  return [
    `Hi Floweraaine! I'd like to order:`,
    `• ${product.name} × ${quantity} (${formatINR(product.price * quantity)})`,
    c.occasion && `• Occasion: ${c.occasion}`,
    c.text && `• Personalized text: "${c.text}"`,
    c.note && `• Gift note: "${c.note}"`,
    c.photoName && `• I have a reference photo (${c.photoName}) to share.`,
  ].filter(Boolean).join('\n');
}

export const hideBrokenImage = (e) => { e.currentTarget.style.opacity = '0' };