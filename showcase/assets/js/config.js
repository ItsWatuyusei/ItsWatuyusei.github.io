const CONFIG = {
  brand: {
    name: 'ItsWatuyusei Bakery',
    poweredBy: 'ItsWatuyusei',
    poweredByUrl: 'https://itswatuyusei.com',
    isWhitelabel: false,
    whatsapp: '584126763167'
  },
  erp: {
    apiUrl: 'https://ve.dolarapi.com/v1/dolares/oficial'
  },
  bcvRate: null,
  i18n: {
    en: {
      searchPlaceholder: 'Search products...',
      all: 'All',
      sweet: 'Sweet',
      savory: 'Savory',
      bestseller: 'Bestseller',
      new: 'New',
      limited: 'Limited',
      noResults: 'No products found.',
      copyright: 'Copyright © ItsWatuyusei',
      buy: 'Buy now',
      back: 'Back to catalog',
      orderMessage: 'Hello! I am interested in ordering: ',
      promos: [
        'Free delivery on orders over $10!',
        'Baked with passion every morning at 6:00 AM',
        'Authentic Venezuelan flavors in every bite',
        'Premium quality artisan ingredients'
      ],
      addToCart: 'Add to order',
      cartTitle: 'My Order',
      total: 'Total (USD)',
      totalBcv: 'Total (VES)',
      bcvLabel: 'Bs. Rate',
      bcvUnavailable: 'Bs. rate unavailable',
      emptyCart: 'Your order is empty',
      sendOrder: 'Send Order to WhatsApp',
      checkoutMessage: 'Hello! I would like to place the following order:',
      clearCart: 'Clear Cart'
    },
    es: {
      searchPlaceholder: 'Buscar productos...',
      all: 'Todos',
      sweet: 'Dulces',
      savory: 'Salados',
      bestseller: 'Más Vendido',
      new: 'Nuevo',
      limited: 'Limitado',
      noResults: 'No se encontraron productos.',
      copyright: 'Copyright © ItsWatuyusei',
      buy: 'Comprar ahora',
      back: 'Volver al catálogo',
      orderMessage: '¡Hola! Me gustaría pedir: ',
      promos: [
        '¡Envío gratis en pedidos superiores a $10!',
        'Horneado con pasión cada mañana a las 6:00 AM',
        'Auténtico sabor venezolano en cada bocado',
        'Ingredientes artesanales de primera calidad'
      ],
      addToCart: 'Añadir al pedido',
      cartTitle: 'Mi Pedido',
      total: 'Total (USD)',
      totalBcv: 'Total (VES)',
      bcvLabel: 'Tasa Bs.',
      bcvUnavailable: 'Tasa Bs. no disponible',
      emptyCart: 'Tu pedido está vacío',
      sendOrder: 'Enviar pedido por WhatsApp',
      checkoutMessage: '¡Hola! Me gustaría realizar el siguiente pedido:',
      clearCart: 'Limpiar Carrito'
    },

  },
  products: [
    {
      id: 'prod_01',
      name: { en: 'Catalinas', es: 'Catalinas' },
      category: 'sweet',
      price: 2.67,
      badge: 'bestseller',
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/catalinas00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/catalinas01.webp'],
      description: {
        en: 'Traditional soft cookie made with raw cane sugar (papelón) and sweet spices.',
        es: 'Galleta suave tradicional hecha con papelón y especias dulces.'
      }
    },
    {
      id: 'prod_02',
      name: { en: 'Polvorosas', es: 'Polvorosas' },
      category: 'sweet',
      price: 2.94,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj3rdUKWy9pyKhSWyqfRwXB_mLb_XQ0wrl4w&s',
      description: {
        en: 'Crumbly, melt-in-your-mouth shortbread cookies dusted with powdered sugar.',
        es: 'Galletas de mantequilla que se deshacen en la boca, espolvoreadas con azúcar.'
      }
    },
    {
      id: 'prod_03',
      name: { en: 'Colombianito', es: 'Colombianito' },
      category: 'sweet',
      price: 1.53,
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/colombianito00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/colombianito0.webp'],
      description: {
        en: 'Sweet bread roll typical of Venezuelan bakeries, soft and slightly sugary.',
        es: 'Pan dulce pequeño típico de las panaderías venezolanas, suave y azucarado.'
      }
    },
    {
      id: 'prod_04',
      name: { en: 'Guava Bread', es: 'Pan de Guayaba' },
      category: 'sweet',
      price: 1.95,
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panArequipe00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panArequipe01.webp'],
      description: {
        en: 'Soft sweet bread filled with rich, homemade guava jam.',
        es: 'Pan dulce suave relleno con abundante mermelada de guayaba.'
      }
    },
    {
      id: 'prod_05',
      name: { en: 'Arequipe Bread', es: 'Pan de Arequipe' },
      category: 'sweet',
      price: 1.72,
      badge: 'new',
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panArequipe00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panArequipe01.webp'],
      description: {
        en: 'Soft sweet bread generously filled with smooth caramel (arequipe).',
        es: 'Pan dulce suave relleno generosamente con dulce de leche (arequipe).'
      }
    },
    {
      id: 'prod_06',
      name: { en: 'Arequipe Pastry', es: 'Pastel de Arequipe' },
      category: 'sweet',
      price: 2.40,
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/pastelArequipe00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/pastelArequipe01.webp'],
      description: {
        en: 'Flaky puff pastry pocket filled with creamy caramel (arequipe).',
        es: 'Pastelito de hojaldre crujiente relleno de cremoso arequipe.'
      }
    },
    {
      id: 'prod_07',
      name: { en: 'Guava Pastry', es: 'Pastel de Guayaba' },
      category: 'sweet',
      price: 2.40,
      badge: 'bestseller',
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/pastelGuayaba00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/pastelGuayaba01.webp'],
      description: {
        en: 'Flaky puff pastry pocket filled with sweet guava paste.',
        es: 'Pastelito de hojaldre crujiente relleno de pasta de guayaba dulce.'
      }
    },
    {
      id: 'prod_08',
      name: { en: 'Cheese Bread', es: 'Pan de Queso' },
      category: 'savory',
      price: 1.99,
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panQueso00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panQueso01.webp'],
      description: {
        en: 'Soft bread filled and topped with salty white cheese.',
        es: 'Pan suave relleno y cubierto con queso blanco salado.'
      }
    },
    {
      id: 'prod_09',
      name: { en: 'Quesadilla', es: 'Quesadilla' },
      category: 'sweet',
      price: 2.40,
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/quesadilla00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/quesadilla01.webp'],
      description: {
        en: 'Venezuelan sweet pastry filled with a sweet cheese mixture.',
        es: 'Pastelería dulce venezolana rellena con una mezcla de queso dulce.'
      }
    },
    {
      id: 'prod_10',
      name: { en: 'Cortadito', es: 'Cortadito' },
      category: 'sweet',
      price: 1.82,
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/cortadito00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/cortadito01.webp'],
      description: {
        en: 'Traditional spongy cake layered with sweet cream or guava.',
        es: 'Bizcocho tradicional en capas relleno de crema dulce o guayaba.'
      }
    },
    {
      id: 'prod_11',
      name: { en: 'French Bread', es: 'Pan Salado (Francés)' },
      category: 'savory',
      price: 1.76,
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panSalado00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panSalado01.webp'],
      description: {
        en: 'Classic Venezuelan bakery French bread, crusty outside and soft inside.',
        es: 'Clásico pan francés de panadería, crujiente por fuera y suave por dentro.'
      }
    },
    {
      id: 'prod_12',
      name: { en: 'Canilla Bread', es: 'Pan Salado (Canilla)' },
      category: 'savory',
      price: 1.92,
      badge: 'new',
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panSalado00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/panSalado01.webp'],
      description: {
        en: 'The essential Venezuelan long bread, perfect for making sandwiches.',
        es: 'El pan largo esencial de Venezuela, perfecto para rellenar.'
      }
    },
    {
      id: 'prod_13',
      name: { en: 'Golfiado', es: 'Golfiado' },
      category: 'sweet',
      price: 1.89,
      badge: 'limited',
      image: ['https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/golfiado00.webp', 'https://ik.imagekit.io/ItsWatuyusei/Image/Bakery/golfiado01.webp'],
      description: {
        en: 'Sweet bread roll flavored with anise, covered in raw cane sugar syrup and white cheese.',
        es: 'Pan dulce enrollado con anís, bañado en melao de papelón y queso blanco.'
      }
    },
    {
      id: 'prod_14',
      name: { en: 'Coconut Cookies', es: 'Galletas de Coco' },
      category: 'sweet',
      price: 1.3,
      image: [],
      description: {
        en: 'Delicious crunchy cookies with a rich coconut flavor.',
        es: 'Deliciosas galletas crujientes con un intenso sabor a coco.'
      }
    },
    {
      id: 'prod_15',
      name: { en: 'Milk Bread', es: 'Pan de Leche' },
      category: 'sweet',
      price: 1.3,
      image: [],
      description: {
        en: 'Super soft and fluffy bread rolls made with fresh milk.',
        es: 'Panecillos súper suaves y esponjosos hechos con leche fresca.'
      }
    },
    {
      id: 'prod_16',
      name: { en: 'Pinita Bread', es: 'Pan Piñita' },
      category: 'sweet',
      price: 1.3,
      image: [],
      description: {
        en: 'Traditional sweet bread with a sugary crust and a hint of vanilla.',
        es: 'Pan dulce tradicional con costra de azúcar y un toque de vainilla.'
      }
    }
  ]
};

window.CONFIG = CONFIG;
