const CONFIG = {
  brand: {
    name: 'ItsWatuyusei Bakery',
    poweredBy: 'ItsWatuyusei',
    poweredByUrl: 'https://itswatuyusei.com',
    isWhitelabel: false,
    whatsapp: '584126763167'
  },
  i18n: {
    en: {
      searchPlaceholder: 'Search products...',
      all: 'All',
      sweet: 'Sweet',
      savory: 'Savory',
      noResults: 'No products found.',
      copyright: 'Copyright © ItsWatuyusei',
      buy: 'Buy on WhatsApp',
      back: 'Back to catalog',
      orderMessage: 'Hello! I am interested in ordering: '
    },
    es: {
      searchPlaceholder: 'Buscar productos...',
      all: 'Todos',
      sweet: 'Dulces',
      savory: 'Salados',
      noResults: 'No se encontraron productos.',
      copyright: 'Copyright © ItsWatuyusei',
      buy: 'Comprar por WhatsApp',
      back: 'Volver al catálogo',
      orderMessage: '¡Hola! Me gustaría pedir: '
    },
    pt: {
      searchPlaceholder: 'Buscar produtos...',
      all: 'Todos',
      sweet: 'Doces',
      savory: 'Salgados',
      noResults: 'Nenhum producto encontrado.',
      copyright: 'Copyright © ItsWatuyusei',
      buy: 'Comprar pelo WhatsApp',
      back: 'Voltar ao catálogo',
      orderMessage: 'Olá! Gostaria de encomendar: '
    }
  },
  products: [
    {
      id: 'prod_01',
      name: {
        en: 'Golden Croissant',
        es: 'Cruasán Dorado',
        pt: 'Croissant Dourado'
      },
      category: 'savory',
      price: 2.50,
      image: 'croissant_savory_1777560964071.png',
      description: {
        en: 'Flaky, buttery crescent-shaped bread, perfectly baked to a golden crisp.',
        es: 'Pan en forma de media luna, hojaldrado y con mantequilla, horneado a la perfección.'
      }
    },
    {
      id: 'prod_02',
      name: {
        en: 'Chocolate Ganache Cake',
        es: 'Pastel de Ganache de Chocolate',
        pt: 'Bolo de Ganache de Chocolate'
      },
      category: 'sweet',
      price: 15.00,
      image: 'chocolate_cake_sweet_1777561087967.png',
      description: {
        en: 'Rich and moist chocolate cake layered with silky ganache for a truly decadent experience.',
        es: 'Pastel de chocolate suave y húmedo con capas de ganache sedoso para una experiencia decadente.'
      }
    },
    {
      id: 'prod_03',
      name: {
        en: 'Artisan Sourdough',
        es: 'Masa Madre Artesanal',
        pt: 'Pão de Fermentação Natural'
      },
      category: 'savory',
      price: 4.80,
      image: 'artisan_bread_savory_1777561153256.png',
      description: {
        en: 'Traditional sourdough with a tangy flavor and a perfectly chewy crust.',
        es: 'Masa madre tradicional con un sabor intenso y una corteza perfectamente crujiente.'
      }
    },
    {
      id: 'prod_04',
      name: {
        en: 'Strawberry Tart',
        es: 'Tarta de Fresa',
        pt: 'Torta de Morango'
      },
      category: 'sweet',
      price: 3.20,
      image: 'strawberry_tart_sweet_1777561230311.png',
      description: {
        en: 'Sweet buttery crust filled with vanilla pastry cream and topped with fresh, seasonal strawberries.',
        es: 'Corteza dulce de mantequilla rellena con crema pastelera de vainilla y fresas frescas de temporada.'
      }
    },
    {
      id: 'prod_05',
      name: {
        en: 'Baguette Tradition',
        es: 'Baguette Tradicional',
        pt: 'Baguette Tradicional'
      },
      category: 'savory',
      price: 1.80,
      image: 'artisan_bread_savory_1777561153256.png',
      description: {
        en: 'The classic French baguette, with a thin, crispy crust and a light, airy center.',
        es: 'La clásica baguette francesa, con una corteza fina y crujiente y un centro ligero y esponjoso.'
      }
    },
    {
      id: 'prod_06',
      name: {
        en: 'Glazed Donut',
        es: 'Dona Glaseada',
        pt: 'Donut Glaceado'
      },
      category: 'sweet',
      price: 1.50,
      image: 'strawberry_tart_sweet_1777561230311.png',
      description: {
        en: 'Soft, airy dough fried to golden perfection and dipped in a sweet sugar glaze.',
        es: 'Masa suave y esponjosa frita a la perfección y bañada en un glaseado de azúcar dulce.'
      }
    },
    {
      id: 'prod_07',
      name: {
        en: 'Blueberry Muffin',
        es: 'Muffin de Arándanos',
        pt: 'Muffin de Mirtilo'
      },
      category: 'sweet',
      price: 2.75,
      image: 'chocolate_cake_sweet_1777561087967.png',
      description: {
        en: 'Fluffy muffin packed with juicy blueberries and topped with a light sugar crumble.',
        es: 'Muffin esponjoso lleno de arándanos jugosos y coronado con un ligero crumble de azúcar.'
      }
    },
    {
      id: 'prod_08',
      name: {
        en: 'Cheese Danish',
        es: 'Danesa de Queso',
        pt: 'Folhado de Queijo'
      },
      category: 'savory',
      price: 3.10,
      image: 'croissant_savory_1777560964071.png',
      description: {
        en: 'Buttery flaky pastry filled with a creamy, lightly sweetened cheese center.',
        es: 'Hojaldre de mantequilla relleno con un centro de queso cremoso ligeramente endulzado.'
      }
    },
    {
      id: 'prod_09',
      name: {
        en: 'Cinnamon Roll',
        es: 'Rollo de Canela',
        pt: 'Rolo de Canela'
      },
      category: 'sweet',
      price: 3.50,
      image: 'strawberry_tart_sweet_1777561230311.png',
      description: {
        en: 'Soft dough rolled with cinnamon and sugar, finished with a generous swirl of cream cheese icing.',
        es: 'Masa suave enrollada con canela y azúcar, terminada con un generoso remolino de glaseado de queso crema.'
      }
    },
    {
      id: 'prod_10',
      name: {
        en: 'Focaccia Romana',
        es: 'Focaccia Romana',
        pt: 'Focaccia Romana'
      },
      category: 'savory',
      price: 4.20,
      image: 'artisan_bread_savory_1777561153256.png',
      description: {
        en: 'Classic Italian flatbread seasoned with rosemary, sea salt, and extra virgin olive oil.',
        es: 'Pan plano italiano clásico sazonado con romero, sal marina y aceite de oliva virgen extra.'
      }
    }
  ]
};

window.CONFIG = CONFIG;
Object.freeze(window.CONFIG);
