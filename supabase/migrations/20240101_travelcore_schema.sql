-- TravelCore Platform Schema

-- Destinations table
CREATE TABLE IF NOT EXISTS public.destinations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    country text NOT NULL,
    region text,
    short_description text,
    hero_image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tours table
CREATE TABLE IF NOT EXISTS public.tours (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    short_description text,
    long_description text,
    price_usd numeric(10,2),
    duration_days integer,
    difficulty text CHECK (difficulty IN ('Fácil', 'Moderado', 'Intenso')),
    destination_id uuid REFERENCES public.destinations(id) ON DELETE SET NULL,
    category text,
    start_dates jsonb DEFAULT '[]'::jsonb,
    featured boolean DEFAULT false,
    hero_image_url text,
    gallery_image_urls jsonb DEFAULT '[]'::jsonb,
    itinerary jsonb DEFAULT '[]'::jsonb,
    includes jsonb DEFAULT '[]'::jsonb,
    excludes jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    text text NOT NULL,
    image_url text,
    source text,
    rating integer DEFAULT 5,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    trip_type text,
    message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Insert sample destinations
INSERT INTO public.destinations (name, country, region, short_description, hero_image_url) VALUES
('Madrid', 'España', 'Europa', 'La vibrante capital española con su rica historia, arte y gastronomía.', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80'),
('París', 'Francia', 'Europa', 'La ciudad del amor, la moda y la cultura por excelencia.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'),
('Bogotá', 'Colombia', 'Suramérica', 'Una metrópolis andina llena de historia, arte y sabor.', 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&q=80'),
('Galápagos', 'Ecuador', 'Suramérica', 'Un paraíso natural único con fauna endémica extraordinaria.', 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&q=80'),
('Cusco', 'Perú', 'Suramérica', 'La antigua capital del Imperio Inca y puerta a Machu Picchu.', 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80'),
('Cancún', 'México', 'Centroamérica', 'Playas paradisíacas y la magia del Caribe mexicano.', 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&q=80'),
('Roma', 'Italia', 'Europa', 'La ciudad eterna con milenios de historia y arte.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'),
('Orlando', 'Estados Unidos', 'Norteamérica', 'El destino mágico de los parques temáticos más famosos del mundo.', 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=800&q=80')
ON CONFLICT DO NOTHING;

-- Insert sample tours
INSERT INTO public.tours (title, slug, short_description, long_description, price_usd, duration_days, difficulty, destination_id, category, featured, hero_image_url, itinerary, includes, excludes) VALUES
(
    'Encantos de Bogotá y la Catedral de Sal de Zipaquirá',
    'encantos-bogota-catedral-sal-zipaquira',
    'Descubre la magia de la capital colombiana y la impresionante Catedral de Sal.',
    'Un viaje inolvidable por Bogotá, donde explorarás el centro histórico de La Candelaria, el Museo del Oro, y la impresionante Catedral de Sal de Zipaquirá, una maravilla arquitectónica construida en el interior de una mina de sal.',
    899,
    5,
    'Fácil',
    (SELECT id FROM public.destinations WHERE name = 'Bogotá'),
    'Cultural',
    true,
    'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&q=80',
    '[{"day": 1, "title": "Llegada a Bogotá", "description": "Recepción en el aeropuerto y traslado al hotel. Tarde libre para aclimatación."}, {"day": 2, "title": "Centro Histórico", "description": "Tour por La Candelaria, Plaza Bolívar, Museo del Oro y Museo Botero."}, {"day": 3, "title": "Catedral de Sal", "description": "Excursión a Zipaquirá y visita a la impresionante Catedral de Sal."}, {"day": 4, "title": "Monserrate", "description": "Ascenso al cerro de Monserrate y vista panorámica de la ciudad."}, {"day": 5, "title": "Despedida", "description": "Tiempo libre y traslado al aeropuerto."}]',
    '["Alojamiento 4 noches", "Desayunos diarios", "Traslados aeropuerto-hotel-aeropuerto", "Tours mencionados con guía", "Entradas a atracciones"]',
    '["Vuelos internacionales", "Comidas no mencionadas", "Propinas", "Gastos personales"]'
),
(
    'Galápagos a tu Alcance',
    'galapagos-tu-alcance',
    'Vive la experiencia única de las Islas Galápagos con fauna extraordinaria.',
    'Explora el archipiélago más fascinante del mundo. Observa tortugas gigantes, iguanas marinas, lobos marinos y una increíble variedad de aves en su hábitat natural. Una experiencia que cambiará tu perspectiva del mundo natural.',
    2499,
    7,
    'Moderado',
    (SELECT id FROM public.destinations WHERE name = 'Galápagos'),
    'Aventura',
    true,
    'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&q=80',
    '[{"day": 1, "title": "Llegada a Baltra", "description": "Vuelo a Galápagos, traslado a Santa Cruz y visita a la Estación Charles Darwin."}, {"day": 2, "title": "Isla Santa Cruz", "description": "Visita a los túneles de lava y reserva de tortugas gigantes."}, {"day": 3, "title": "Isla Isabela", "description": "Navegación a Isabela, snorkel con lobos marinos y pingüinos."}, {"day": 4, "title": "Volcán Sierra Negra", "description": "Caminata al cráter del volcán Sierra Negra."}, {"day": 5, "title": "Los Túneles", "description": "Tour a Los Túneles, formaciones de lava y snorkel."}, {"day": 6, "title": "Bahía Tortuga", "description": "Regreso a Santa Cruz, caminata a Bahía Tortuga."}, {"day": 7, "title": "Despedida", "description": "Traslado al aeropuerto de Baltra."}]',
    '["Vuelos Quito-Galápagos-Quito", "Alojamiento 6 noches", "Todas las comidas", "Tours y actividades", "Guía naturalista", "Equipo de snorkel"]',
    '["Entrada al Parque Nacional ($100)", "Tarjeta de tránsito ($20)", "Propinas", "Bebidas alcohólicas"]'
),
(
    'Perú Diferente: Lima, Paracas, Ica y Cusco',
    'peru-diferente-lima-paracas-ica-cusco',
    'Un recorrido completo por lo mejor de Perú: costa, desierto y montaña.',
    'Descubre la diversidad de Perú en un solo viaje. Desde la gastronomía de Lima, las Islas Ballestas y el oasis de Huacachina, hasta la majestuosidad de Cusco y Machu Picchu. Una aventura que combina cultura, naturaleza y historia.',
    1899,
    10,
    'Moderado',
    (SELECT id FROM public.destinations WHERE name = 'Cusco'),
    'Cultural',
    true,
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
    '[{"day": 1, "title": "Lima", "description": "Llegada a Lima, traslado al hotel en Miraflores."}, {"day": 2, "title": "Lima Colonial", "description": "Tour por el centro histórico, Catedral y Convento de San Francisco."}, {"day": 3, "title": "Paracas", "description": "Viaje a Paracas, tour a las Islas Ballestas."}, {"day": 4, "title": "Ica", "description": "Visita a Huacachina, sandboarding y paseo en buggy."}, {"day": 5, "title": "Vuelo a Cusco", "description": "Vuelo a Cusco, tarde de aclimatación."}, {"day": 6, "title": "Valle Sagrado", "description": "Tour por Pisac, Ollantaytambo y mercados locales."}, {"day": 7, "title": "Machu Picchu", "description": "Tren a Aguas Calientes y visita a Machu Picchu."}, {"day": 8, "title": "Cusco", "description": "City tour: Sacsayhuamán, Qenqo, Tambomachay."}, {"day": 9, "title": "Día libre", "description": "Día libre para explorar Cusco."}, {"day": 10, "title": "Regreso", "description": "Traslado al aeropuerto."}]',
    '["Alojamiento 9 noches", "Desayunos diarios", "Vuelos internos", "Tren a Machu Picchu", "Tours con guía", "Entradas"]',
    '["Vuelos internacionales", "Almuerzos y cenas", "Propinas", "Seguro de viaje"]'
),
(
    'Magia de Orlando: Parques Temáticos',
    'magia-orlando-parques-tematicos',
    'Vive la magia de Disney World y Universal Studios en Orlando.',
    'El destino soñado para toda la familia. Disfruta de los parques temáticos más famosos del mundo: Magic Kingdom, Epcot, Hollywood Studios, Animal Kingdom y Universal Studios. Diversión garantizada para todas las edades.',
    1599,
    6,
    'Fácil',
    (SELECT id FROM public.destinations WHERE name = 'Orlando'),
    'Theme Parks',
    true,
    'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=800&q=80',
    '[{"day": 1, "title": "Llegada", "description": "Llegada a Orlando, traslado al hotel."}, {"day": 2, "title": "Magic Kingdom", "description": "Día completo en Magic Kingdom."}, {"day": 3, "title": "Epcot", "description": "Explora Epcot y World Showcase."}, {"day": 4, "title": "Universal Studios", "description": "Aventuras en Universal Studios y Islands of Adventure."}, {"day": 5, "title": "Animal Kingdom", "description": "Safari y atracciones en Animal Kingdom."}, {"day": 6, "title": "Regreso", "description": "Tiempo libre y traslado al aeropuerto."}]',
    '["Alojamiento 5 noches", "Desayunos", "Traslados", "Entradas a 4 parques", "FastPass+"]',
    '["Vuelos", "Comidas en parques", "Souvenirs", "Propinas"]'
),
(
    'Escapada Romántica a París',
    'escapada-romantica-paris',
    'Descubre la ciudad del amor con este tour romántico por París.',
    'París, la ciudad de las luces, te espera con sus monumentos icónicos, su exquisita gastronomía y su atmósfera romántica. Torre Eiffel, Louvre, Montmartre y crucero por el Sena incluidos.',
    1299,
    5,
    'Fácil',
    (SELECT id FROM public.destinations WHERE name = 'París'),
    'Cultural',
    false,
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    '[{"day": 1, "title": "Bienvenue", "description": "Llegada a París, traslado al hotel en Le Marais."}, {"day": 2, "title": "París Clásico", "description": "Torre Eiffel, Arco del Triunfo, Campos Elíseos."}, {"day": 3, "title": "Arte y Cultura", "description": "Museo del Louvre y paseo por el Sena."}, {"day": 4, "title": "Montmartre", "description": "Sacré-Cœur, artistas de Montmartre, cena romántica."}, {"day": 5, "title": "Au revoir", "description": "Tiempo libre y traslado al aeropuerto."}]',
    '["Alojamiento 4 noches boutique", "Desayunos", "Traslados", "Tours guiados", "Crucero por el Sena", "Cena romántica"]',
    '["Vuelos", "Entradas a museos", "Propinas"]'
),
(
    'Roma Imperial',
    'roma-imperial',
    'Viaja en el tiempo por la ciudad eterna y sus monumentos milenarios.',
    'Descubre la grandeza del Imperio Romano caminando por el Coliseo, el Foro Romano y el Vaticano. Una inmersión en la historia, el arte y la deliciosa gastronomía italiana.',
    1199,
    5,
    'Fácil',
    (SELECT id FROM public.destinations WHERE name = 'Roma'),
    'Historia',
    false,
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    '[{"day": 1, "title": "Benvenuti", "description": "Llegada a Roma, traslado al hotel cerca del Panteón."}, {"day": 2, "title": "Roma Antigua", "description": "Coliseo, Foro Romano, Palatino."}, {"day": 3, "title": "Vaticano", "description": "Museos Vaticanos, Capilla Sixtina, Basílica de San Pedro."}, {"day": 4, "title": "Roma Barroca", "description": "Fontana di Trevi, Plaza Navona, Panteón."}, {"day": 5, "title": "Arrivederci", "description": "Tiempo libre y traslado al aeropuerto."}]',
    '["Alojamiento 4 noches", "Desayunos", "Traslados", "Tours guiados", "Entradas sin filas"]',
    '["Vuelos", "Almuerzos y cenas", "Propinas"]'
),
(
    'Aventura en Cancún y Riviera Maya',
    'aventura-cancun-riviera-maya',
    'Sol, playa y aventura en el Caribe mexicano.',
    'Combina relax en playas paradisíacas con aventuras en cenotes, ruinas mayas y la vibrante vida nocturna de Cancún. Incluye visita a Chichén Itzá y nado en cenotes.',
    1099,
    6,
    'Moderado',
    (SELECT id FROM public.destinations WHERE name = 'Cancún'),
    'Playa',
    true,
    'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&q=80',
    '[{"day": 1, "title": "Bienvenidos", "description": "Llegada a Cancún, traslado al resort all-inclusive."}, {"day": 2, "title": "Playa", "description": "Día de relax en la playa y piscinas del resort."}, {"day": 3, "title": "Chichén Itzá", "description": "Excursión a Chichén Itzá y cenote Ik Kil."}, {"day": 4, "title": "Isla Mujeres", "description": "Tour a Isla Mujeres, snorkel y playa."}, {"day": 5, "title": "Xcaret", "description": "Día completo en parque Xcaret."}, {"day": 6, "title": "Despedida", "description": "Tiempo libre y traslado al aeropuerto."}]',
    '["Resort all-inclusive 5 noches", "Todas las comidas y bebidas", "Traslados", "Excursiones mencionadas", "Entrada a Xcaret"]',
    '["Vuelos", "Propinas", "Actividades opcionales"]'
),
(
    'Madrid y Toledo: Historia Viva',
    'madrid-toledo-historia-viva',
    'Explora la capital española y la ciudad imperial de Toledo.',
    'Descubre el corazón de España: los museos de clase mundial de Madrid, su vibrante vida nocturna y la mágica ciudad medieval de Toledo, Patrimonio de la Humanidad.',
    999,
    5,
    'Fácil',
    (SELECT id FROM public.destinations WHERE name = 'Madrid'),
    'Cultural',
    false,
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80',
    '[{"day": 1, "title": "Hola Madrid", "description": "Llegada, traslado al hotel en Gran Vía."}, {"day": 2, "title": "Madrid Monumental", "description": "Palacio Real, Plaza Mayor, Puerta del Sol."}, {"day": 3, "title": "Arte", "description": "Museo del Prado y Parque del Retiro."}, {"day": 4, "title": "Toledo", "description": "Excursión de día completo a Toledo."}, {"day": 5, "title": "Adiós", "description": "Tiempo libre y traslado al aeropuerto."}]',
    '["Alojamiento 4 noches", "Desayunos", "Traslados", "Tours guiados", "Excursión a Toledo"]',
    '["Vuelos", "Entradas a museos", "Comidas", "Propinas"]'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample testimonials
INSERT INTO public.testimonials (name, text, image_url, source, rating) VALUES
('María González', 'TravelCore hizo realidad nuestro sueño de conocer Galápagos. Todo perfectamente organizado, sin preocupaciones. ¡Volveremos a viajar con ellos!', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', 'Viaje a Galápagos 2024', 5),
('Carlos Rodríguez', 'Increíble experiencia en Perú. El equipo de TravelCore se encargó de cada detalle. Machu Picchu superó todas mis expectativas.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 'Perú Diferente 2024', 5),
('Ana Martínez', 'Viajamos en familia a Orlando y fue mágico. Los niños no paran de hablar de los parques. Gracias TravelCore por hacer todo tan fácil.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 'Orlando Mágico 2024', 5),
('Roberto Sánchez', 'París romántico fue el viaje perfecto para nuestro aniversario. Cada restaurante, cada hotel, todo impecable. 100% recomendado.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', 'Escapada París 2024', 5)
ON CONFLICT DO NOTHING;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tours_destination ON public.tours(destination_id);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON public.tours(featured);
CREATE INDEX IF NOT EXISTS idx_tours_category ON public.tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON public.tours(slug);
