export const STORE = {
  name: 'Floweraaine',
  city: 'Mumbai · Kerala',
  email: 'floweraaine@gmail.com',
  whatsappNumber: '919745082273',
  whatsappDisplay: '+91 97450 82273',
  upiId: '7356238385@fam' // Replace with your actual UPI ID
}

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80'

export const OCCASIONS = ['Birthday', 'Anniversary', 'Wedding', 'Just Because', 'Corporate', 'Other']

export const products = [
  {
    id: 'p1',
    name: 'Porsche 911 Frame',
    price: 3500,
    category: 'customizable',
    type: 'cars',
    isTrending: true,
    // Multiple images added for Swiper functionality
    images: [
      'https://images.unsplash.com/photo-1503376762279-58b292db90e8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1502877338593-d3640b714ae0?auto=format&fit=crop&q=80&w=800'
    ],
    image: 'https://images.unsplash.com/photo-1503376762279-58b292db90e8?auto=format&fit=crop&q=80&w=800',
    description: 'A striking 3D shadowbox featuring a die-cast Porsche 911. The backdrop can be personalized with dates or a custom license plate text.',
    features: ['1:32 Scale Model', 'Glass Shadowbox', 'Customizable Backdrop']
  },
  {
    id: 'p2',
    name: 'BMW M4 Hamper Box',
    price: 4800,
    category: 'customizable',
    type: 'hampers',
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&q=80&w=800'
    ],
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800',
    description: 'A highly detailed die-cast BMW M4 paired beautifully with a vibrant bed of artisan soap roses.',
    features: ['Die-cast M4 Model', 'Artisan Soap Roses', 'Magnetic Gift Box']
  },
  {
    id: 'p3',
    name: 'The Azure Marble Hamper',
    price: 5200,
    category: 'ready',
    type: 'hampers',
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
    ],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    description: 'Housed in a stunning azure marble-patterned keepsake box, revealing curated artisan chocolates and luxury treats.',
    features: ['Marble-Pattern Box', 'Artisan Chocolates', 'Premium Finish']
  },
  {
    id: 'p4',
    name: 'Crimson Red Artisan Bouquet',
    price: 1800,
    category: 'ready',
    type: 'floral',
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1546736209-648b2610bb47?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589123053646-4e9a8f2ca354?auto=format&fit=crop&q=80&w=800'
    ],
    image: 'https://images.unsplash.com/photo-1546736209-648b2610bb47?auto=format&fit=crop&q=80&w=800',
    description: 'A bold, romantic arrangement of everlasting crimson red soap roses, elegantly wrapped.',
    features: ['Everlasting Soap Roses', 'Silk Ribbon', 'Premium Wrap']
  },
  {
    id: 'p5',
    name: '3D Collector\'s Frame: Dodge Charger',
    price: 3600,
    category: 'customizable',
    type: 'cars',
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1588127333419-b9d7de223dcf?auto=format&fit=crop&q=80&w=800'
    ],
    image: 'https://images.unsplash.com/photo-1588127333419-b9d7de223dcf?auto=format&fit=crop&q=80&w=800',
    description: 'A dark, sleek tribute to American muscle. This shadowbox mounts a detailed 3D die-cast model.',
    features: ['1:32 Scale Model', 'Matte Black Frame', 'Custom Plate']
  }
]

export const seedReviews = [
  { id: 'r1', name: 'Aarav M.', city: 'Kochi', rating: 5, title: 'Absolutely breathtaking', body: 'The BMW M4 hamper exceeded all my expectations. The soap roses smell amazing and the die-cast model is incredibly detailed.', product: 'BMW M4 Hamper Box', verified: true },
  { id: 'r2', name: 'Nila T.', city: 'Trivandrum', rating: 5, title: 'The perfect anniversary gift', body: 'I ordered the customized Porsche frame for my husband. The attention to detail is stunning.', product: 'Porsche 911 Frame', verified: true },
  { id: 'r3', name: 'Rohan K.', city: 'Calicut', rating: 4, title: 'Beautifully packaged', body: 'The Azure Marble hamper was a hit. Delivery was seamless and the packaging feels incredibly premium.', product: 'The Azure Marble Hamper', verified: true }
]

export const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
export const whatsappLink = (text) => `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(text)}`
export const mailtoLink = (subject, body) => `mailto:${STORE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
export const buildOrderMessage = (p, q, c) => `Hi ${STORE.name}!\n\nI'd like to order:\n${q}x ${p.name}\n\nOccasion: ${c.occasion || 'N/A'}\nPersonalized text: ${c.text || 'N/A'}\nNote: ${c.note || 'N/A'}\n\nPlease guide me through payment!`
export const hideBrokenImage = (e) => { e.currentTarget.style.display = 'none' }