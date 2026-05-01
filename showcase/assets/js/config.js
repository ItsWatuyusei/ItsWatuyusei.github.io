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
      noResults: 'No products found.',
      copyright: 'Copyright © ItsWatuyusei',
      buy: 'Buy now',
      back: 'Back to catalog',
      orderMessage: 'Hello! I am interested in ordering: ',
      promos: [
        'Free delivery on orders over $30!',
        'Freshly baked every morning at 6:00 AM',
        'Traditional artisan recipes with organic ingredients'
      ],
      addToCart: 'Add to order',
      cartTitle: 'My Order',
      total: 'Total (USD)',
      totalBcv: 'Total (VES)',
      bcvLabel: 'Bs. Rate',
      bcvUnavailable: 'Bs. rate unavailable',
      emptyCart: 'Your order is empty',
      sendOrder: 'Send Order to WhatsApp',
      checkoutMessage: 'Hello! I would like to place the following order:'
    },
    es: {
      searchPlaceholder: 'Buscar productos...',
      all: 'Todos',
      sweet: 'Dulces',
      savory: 'Salados',
      noResults: 'No se encontraron productos.',
      copyright: 'Copyright © ItsWatuyusei',
      buy: 'Comprar ahora',
      back: 'Volver al catálogo',
      orderMessage: '¡Hola! Me gustaría pedir: ',
      promos: [
        '¡Envío gratis en pedidos superiores a $30!',
        'Horneado fresco cada mañana a las 6:00 AM',
        'Recetas artesanales con ingredientes orgánicos'
      ],
      addToCart: 'Añadir al pedido',
      cartTitle: 'Mi Pedido',
      total: 'Total (USD)',
      totalBcv: 'Total (VES)',
      bcvLabel: 'Tasa Bs.',
      bcvUnavailable: 'Tasa Bs. no disponible',
      emptyCart: 'Tu pedido está vacío',
      sendOrder: 'Enviar pedido por WhatsApp',
      checkoutMessage: '¡Hola! Me gustaría realizar el siguiente pedido:'
    },

  },
  products: [
    {
      id: 'prod_01',
      name: { en: 'Catalinas', es: 'Catalinas' },
      category: 'sweet',
      price: 1.67,
      image: 'https://via.placeholder.com/400?text=Catalinas',
      description: {
        en: 'Traditional soft cookie made with raw cane sugar (papelón) and sweet spices.',
        es: 'Galleta suave tradicional hecha con papelón y especias dulces.'
      }
    },
    {
      id: 'prod_02',
      name: { en: 'Polvorosas', es: 'Polvorosas' },
      category: 'sweet',
      price: 1.84,
      image: 'https://via.placeholder.com/400?text=Polvorosas',
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
      image: 'https://via.placeholder.com/400?text=Colombianito',
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
      image: 'https://via.placeholder.com/400?text=Pan+de+Guayaba',
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
      image: 'https://via.placeholder.com/400?text=Pan+de+Arequipe',
      description: {
        en: 'Soft sweet bread generously filled with smooth caramel (arequipe).',
        es: 'Pan dulce suave relleno generosamente con dulce de leche (arequipe).'
      }
    },
    {
      id: 'prod_06',
      name: { en: 'Arequipe Pastry', es: 'Pastel de Arequipe' },
      category: 'sweet',
      price: 1.88,
      image: 'https://via.placeholder.com/400?text=Pastel+de+Arequipe',
      description: {
        en: 'Flaky puff pastry pocket filled with creamy caramel (arequipe).',
        es: 'Pastelito de hojaldre crujiente relleno de cremoso arequipe.'
      }
    },
    {
      id: 'prod_07',
      name: { en: 'Guava Pastry', es: 'Pastel de Guayaba' },
      category: 'sweet',
      price: 1.61,
      image: 'https://via.placeholder.com/400?text=Pastel+de+Guayaba',
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
      image: 'https://via.placeholder.com/400?text=Pan+de+Queso',
      description: {
        en: 'Soft bread filled and topped with salty white cheese.',
        es: 'Pan suave relleno y cubierto con queso blanco salado.'
      }
    },
    {
      id: 'prod_09',
      name: { en: 'Quesadilla', es: 'Quesadilla' },
      category: 'sweet',
      price: 1.75,
      image: 'https://via.placeholder.com/400?text=Quesadilla',
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
      image: 'https://via.placeholder.com/400?text=Cortadito',
      description: {
        en: 'Traditional spongy cake layered with sweet cream or guava.',
        es: 'Bizcocho tradicional en capas relleno de crema dulce o guayaba.'
      }
    },
    {
      id: 'prod_11',
      name: { en: 'French Bread', es: 'Pan Salado (Francés)' },
      category: 'savory',
      price: 1.56,
      image: 'https://via.placeholder.com/400?text=Pan+Frances',
      description: {
        en: 'Classic Venezuelan bakery French bread, crusty outside and soft inside.',
        es: 'Clásico pan francés de panadería, crujiente por fuera y suave por dentro.'
      }
    },
    {
      id: 'prod_12',
      name: { en: 'Canilla Bread', es: 'Pan Salado (Canilla)' },
      category: 'savory',
      price: 1.64,
      image: 'https://via.placeholder.com/400?text=Pan+Canilla',
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
      image: 'https://via.placeholder.com/400?text=Golfiado',
      description: {
        en: 'Sweet bread roll flavored with anise, covered in raw cane sugar syrup and white cheese.',
        es: 'Pan dulce enrollado con anís, bañado en melao de papelón y queso blanco.'
      }
    }
  ]
};

window.CONFIG = CONFIG;
