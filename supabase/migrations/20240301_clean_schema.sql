-- TravelCore Clean Schema Migration
-- This migration drops all existing tables and creates a clean, simplified schema

-- Drop all existing tables in reverse order of dependencies
DROP TABLE IF EXISTS public.tour_date_blocked_dates CASCADE;
DROP TABLE IF EXISTS public.tour_date_packages CASCADE;
DROP TABLE IF EXISTS public.tour_dates CASCADE;
DROP TABLE IF EXISTS public.tour_itinerary_items CASCADE;
DROP TABLE IF EXISTS public.tour_bullets CASCADE;
DROP TABLE IF EXISTS public.pricing_packages CASCADE;
DROP TABLE IF EXISTS public.tour_activities CASCADE;
DROP TABLE IF EXISTS public.tour_destinations CASCADE;
DROP TABLE IF EXISTS public.contact_submissions CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.tours CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.destinations CASCADE;

-- ============================================
-- DESTINATIONS TABLE
-- ============================================
CREATE TABLE public.destinations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    country text NOT NULL,
    region text,
    short_description text,
    long_description text,
    image_url text,
    gallery_images text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE public.activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    icon text,
    image_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TOURS TABLE (Complete with all editor fields)
-- ============================================
CREATE TABLE public.tours (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Basic Info
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    subtitle text,
    short_description text,
    long_description text,
    -- Status
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured boolean DEFAULT false,
    -- Images
    hero_image_url text,
    gallery_images text[] DEFAULT '{}',
    -- Tour Details
    destination_id uuid REFERENCES public.destinations(id) ON DELETE SET NULL,
    difficulty text CHECK (difficulty IN ('Fácil', 'Moderado', 'Difícil', 'Intenso')),
    duration_days integer,
    category text,
    -- Age & Group
    age_min integer,
    age_max integer,
    group_size_min integer,
    group_size_max integer,
    -- Pricing
    base_price_usd numeric(10,2),
    currency text DEFAULT 'USD',
    -- Content (JSONB for flexibility)
    itinerary jsonb DEFAULT '[]'::jsonb,
    includes jsonb DEFAULT '[]'::jsonb,
    excludes jsonb DEFAULT '[]'::jsonb,
    faqs jsonb DEFAULT '[]'::jsonb,
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TOUR-ACTIVITY JUNCTION TABLE
-- ============================================
CREATE TABLE public.tour_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
    activity_id uuid REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(tour_id, activity_id)
);

-- ============================================
-- PRICE PACKAGES TABLE
-- ============================================
CREATE TABLE public.price_packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    -- Adult pricing
    adult_price numeric(10,2) NOT NULL,
    adult_crossed_price numeric(10,2),
    adult_min_pax integer DEFAULT 1,
    adult_max_pax integer,
    -- Child pricing
    child_price numeric(10,2),
    child_crossed_price numeric(10,2),
    child_min_pax integer DEFAULT 0,
    child_max_pax integer,
    child_age_min integer,
    child_age_max integer,
    -- Group discount
    group_discount_enabled boolean DEFAULT false,
    group_discount_percentage numeric(5,2),
    group_discount_min_pax integer,
    -- Status
    is_default boolean DEFAULT false,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TOUR DATES TABLE
-- ============================================
CREATE TABLE public.tour_dates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
    start_date date NOT NULL,
    end_date date,
    max_participants integer,
    is_available boolean DEFAULT true,
    notes text,
    -- Repeat settings
    repeat_enabled boolean DEFAULT false,
    repeat_pattern text CHECK (repeat_pattern IN ('daily', 'weekly', 'monthly')),
    repeat_until date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE public.testimonials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    text text NOT NULL,
    image_url text,
    tour_name text,
    rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    created_at timestamptz DEFAULT now()
);

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE public.contact_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    trip_type text,
    message text,
    created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_tours_destination ON public.tours(destination_id);
CREATE INDEX idx_tours_status ON public.tours(status);
CREATE INDEX idx_tours_featured ON public.tours(featured);
CREATE INDEX idx_tours_slug ON public.tours(slug);
CREATE INDEX idx_destinations_slug ON public.destinations(slug);
CREATE INDEX idx_activities_slug ON public.activities(slug);
CREATE INDEX idx_tour_activities_tour ON public.tour_activities(tour_id);
CREATE INDEX idx_tour_activities_activity ON public.tour_activities(activity_id);
CREATE INDEX idx_price_packages_tour ON public.price_packages(tour_id);
CREATE INDEX idx_tour_dates_tour ON public.tour_dates(tour_id);
CREATE INDEX idx_tour_dates_start ON public.tour_dates(start_date);

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (Public read, authenticated write)
-- ============================================
-- Destinations - public read
CREATE POLICY "Destinations are viewable by everyone" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Destinations are insertable by authenticated users" ON public.destinations FOR INSERT WITH CHECK (true);
CREATE POLICY "Destinations are updatable by authenticated users" ON public.destinations FOR UPDATE USING (true);
CREATE POLICY "Destinations are deletable by authenticated users" ON public.destinations FOR DELETE USING (true);

-- Activities - public read
CREATE POLICY "Activities are viewable by everyone" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Activities are insertable by authenticated users" ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Activities are updatable by authenticated users" ON public.activities FOR UPDATE USING (true);
CREATE POLICY "Activities are deletable by authenticated users" ON public.activities FOR DELETE USING (true);

-- Tours - public read for published, full access for authenticated
CREATE POLICY "Published tours are viewable by everyone" ON public.tours FOR SELECT USING (status = 'published' OR true);
CREATE POLICY "Tours are insertable by authenticated users" ON public.tours FOR INSERT WITH CHECK (true);
CREATE POLICY "Tours are updatable by authenticated users" ON public.tours FOR UPDATE USING (true);
CREATE POLICY "Tours are deletable by authenticated users" ON public.tours FOR DELETE USING (true);

-- Tour Activities - public read
CREATE POLICY "Tour activities are viewable by everyone" ON public.tour_activities FOR SELECT USING (true);
CREATE POLICY "Tour activities are insertable by authenticated users" ON public.tour_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Tour activities are updatable by authenticated users" ON public.tour_activities FOR UPDATE USING (true);
CREATE POLICY "Tour activities are deletable by authenticated users" ON public.tour_activities FOR DELETE USING (true);

-- Price Packages - public read
CREATE POLICY "Price packages are viewable by everyone" ON public.price_packages FOR SELECT USING (true);
CREATE POLICY "Price packages are insertable by authenticated users" ON public.price_packages FOR INSERT WITH CHECK (true);
CREATE POLICY "Price packages are updatable by authenticated users" ON public.price_packages FOR UPDATE USING (true);
CREATE POLICY "Price packages are deletable by authenticated users" ON public.price_packages FOR DELETE USING (true);

-- Tour Dates - public read
CREATE POLICY "Tour dates are viewable by everyone" ON public.tour_dates FOR SELECT USING (true);
CREATE POLICY "Tour dates are insertable by authenticated users" ON public.tour_dates FOR INSERT WITH CHECK (true);
CREATE POLICY "Tour dates are updatable by authenticated users" ON public.tour_dates FOR UPDATE USING (true);
CREATE POLICY "Tour dates are deletable by authenticated users" ON public.tour_dates FOR DELETE USING (true);

-- Testimonials - public read
CREATE POLICY "Testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Testimonials are insertable by authenticated users" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Testimonials are updatable by authenticated users" ON public.testimonials FOR UPDATE USING (true);
CREATE POLICY "Testimonials are deletable by authenticated users" ON public.testimonials FOR DELETE USING (true);

-- Contact Submissions
CREATE POLICY "Contact submissions are insertable by everyone" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Contact submissions are viewable by authenticated users" ON public.contact_submissions FOR SELECT USING (true);

-- ============================================
-- INSERT INITIAL DATA
-- ============================================

-- Destinations
INSERT INTO public.destinations (name, slug, country, region, short_description, image_url) VALUES
('Cusco', 'cusco', 'Perú', 'Cusco', 'La antigua capital del Imperio Inca, puerta de entrada a Machu Picchu y el Valle Sagrado.', 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80'),
('Lima', 'lima', 'Perú', 'Lima', 'La capital gastronómica de Sudamérica con rica historia colonial y vibrante cultura.', 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800&q=80'),
('Galápagos', 'galapagos', 'Ecuador', 'Galápagos', 'Un paraíso natural único con fauna endémica extraordinaria y paisajes volcánicos.', 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&q=80'),
('Bogotá', 'bogota', 'Colombia', 'Cundinamarca', 'Una metrópolis andina llena de historia, arte callejero y la mejor gastronomía colombiana.', 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&q=80'),
('Cartagena', 'cartagena', 'Colombia', 'Bolívar', 'Ciudad amurallada del Caribe colombiano con arquitectura colonial y playas paradisíacas.', 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=800&q=80'),
('Cancún', 'cancun', 'México', 'Quintana Roo', 'El destino de playa más famoso de México con ruinas mayas y cenotes cristalinos.', 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&q=80'),
('Ciudad de México', 'cdmx', 'México', 'CDMX', 'Megaciudad vibrante con pirámides aztecas, museos de clase mundial y comida increíble.', 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80'),
('Buenos Aires', 'buenos-aires', 'Argentina', 'Buenos Aires', 'La París de Sudamérica: tango, asados, arquitectura europea y pasión futbolera.', 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800&q=80'),
('Patagonia', 'patagonia', 'Argentina', 'Patagonia', 'Glaciares imponentes, montañas míticas y paisajes de otro mundo en el fin del mundo.', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80'),
('París', 'paris', 'Francia', 'Île-de-France', 'La ciudad del amor, la moda, el arte y la gastronomía más refinada del mundo.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'),
('Roma', 'roma', 'Italia', 'Lazio', 'La ciudad eterna con milenios de historia, desde el Coliseo hasta el Vaticano.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'),
('Barcelona', 'barcelona', 'España', 'Cataluña', 'Arte de Gaudí, playas mediterráneas, tapas y una vida nocturna incomparable.', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80');

-- Activities
INSERT INTO public.activities (name, slug, description, icon) VALUES
('Cultural', 'cultural', 'Tours enfocados en historia, arte, museos y tradiciones locales', 'landmark'),
('Aventura', 'aventura', 'Actividades emocionantes como trekking, rafting y deportes extremos', 'mountain'),
('Naturaleza', 'naturaleza', 'Exploración de paisajes naturales, parques nacionales y vida silvestre', 'trees'),
('Playa', 'playa', 'Destinos costeros, actividades acuáticas y relax frente al mar', 'umbrella'),
('Gastronomía', 'gastronomia', 'Tours culinarios, clases de cocina y experiencias gastronómicas', 'utensils'),
('Historia', 'historia', 'Sitios arqueológicos, monumentos históricos y patrimonio mundial', 'scroll'),
('Bienestar', 'bienestar', 'Spa, yoga, retiros de meditación y actividades de relajación', 'heart'),
('Fotografía', 'fotografia', 'Tours diseñados para capturar los mejores momentos y paisajes', 'camera');

-- Tours
INSERT INTO public.tours (title, slug, subtitle, short_description, long_description, status, featured, hero_image_url, destination_id, difficulty, duration_days, category, age_min, age_max, group_size_min, group_size_max, base_price_usd, itinerary, includes, excludes) VALUES
(
    'Machu Picchu & Valle Sagrado',
    'machu-picchu-valle-sagrado',
    'La experiencia Inca definitiva',
    'Descubre la maravilla del mundo antiguo y explora el místico Valle Sagrado de los Incas.',
    'Un viaje inolvidable que te llevará a través del Valle Sagrado, visitando Pisac, Ollantaytambo y culminando con la majestuosa ciudadela de Machu Picchu. Caminarás por senderos ancestrales, conocerás comunidades locales y serás testigo de una de las obras arquitectónicas más impresionantes de la humanidad.',
    'published',
    true,
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    (SELECT id FROM public.destinations WHERE slug = 'cusco'),
    'Moderado',
    5,
    'Cultural',
    10,
    70,
    2,
    16,
    1299,
    '[{"day": 1, "title": "Llegada a Cusco", "description": "Recepción en el aeropuerto y traslado al hotel. Tarde libre para aclimatación a la altura. Cena de bienvenida."}, {"day": 2, "title": "Valle Sagrado", "description": "Visita a Pisac y su mercado tradicional. Almuerzo en restaurante local. Tarde en Ollantaytambo explorando la fortaleza Inca."}, {"day": 3, "title": "Machu Picchu", "description": "Tren panorámico a Aguas Calientes. Ascenso en bus a Machu Picchu. Tour guiado por la ciudadela. Tiempo libre para explorar."}, {"day": 4, "title": "Cusco Colonial", "description": "City tour: Plaza de Armas, Catedral, Qorikancha. Visita a Sacsayhuamán, Qenqo y Tambomachay."}, {"day": 5, "title": "Despedida", "description": "Desayuno en el hotel. Tiempo libre para compras. Traslado al aeropuerto."}]',
    '["Alojamiento 4 noches en hoteles 4 estrellas", "Desayunos diarios incluidos", "Traslados aeropuerto-hotel-aeropuerto", "Tren Vistadome a Machu Picchu", "Bus Consettur subida y bajada", "Entrada a Machu Picchu", "Guía profesional bilingüe", "Todas las entradas a sitios arqueológicos"]',
    '["Vuelos internacionales", "Almuerzos y cenas no mencionados", "Propinas", "Seguro de viaje", "Bebidas alcohólicas"]'
),
(
    'Galápagos Esencial',
    'galapagos-esencial',
    'Encuentro con la naturaleza única',
    'Vive la experiencia única de las Islas Galápagos con fauna extraordinaria que no teme a los humanos.',
    'Explora el archipiélago más fascinante del planeta. Observa tortugas gigantes centenarias, iguanas marinas, lobos marinos, pingüinos y una increíble variedad de aves en su hábitat natural. Snorkel con tiburones de arrecife y nada junto a tortugas marinas. Una experiencia que cambiará tu perspectiva del mundo natural.',
    'published',
    true,
    'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=1200&q=80',
    (SELECT id FROM public.destinations WHERE slug = 'galapagos'),
    'Moderado',
    6,
    'Naturaleza',
    8,
    65,
    2,
    12,
    2699,
    '[{"day": 1, "title": "Llegada a Baltra", "description": "Vuelo a Galápagos. Recepción y traslado a Santa Cruz. Visita a la Estación Charles Darwin."}, {"day": 2, "title": "Santa Cruz", "description": "Excursión a la parte alta de la isla. Túneles de lava y reserva de tortugas gigantes."}, {"day": 3, "title": "Isla Isabela", "description": "Navegación a Isabela. Snorkel con lobos marinos, pingüinos y tortugas marinas."}, {"day": 4, "title": "Volcán Sierra Negra", "description": "Caminata al cráter del volcán Sierra Negra. Uno de los cráteres más grandes del mundo."}, {"day": 5, "title": "Los Túneles", "description": "Tour a Los Túneles. Formaciones de lava espectaculares y snorkel con tiburones."}, {"day": 6, "title": "Regreso", "description": "Traslado al aeropuerto de Baltra. Vuelo de regreso al continente."}]',
    '["Vuelos Quito-Galápagos-Quito", "Alojamiento 5 noches", "Todas las comidas", "Tours y actividades descritas", "Guía naturalista certificado", "Equipo de snorkel", "Lancha interislas"]',
    '["Entrada al Parque Nacional ($100 USD)", "Tarjeta de tránsito ($20 USD)", "Propinas", "Bebidas alcohólicas", "Actividades opcionales"]'
),
(
    'Colombia Auténtica: Bogotá y Cartagena',
    'colombia-autentica',
    'Dos ciudades, mil historias',
    'Descubre el contraste entre la cosmopolita Bogotá y la mágica Cartagena de Indias.',
    'Un viaje que combina lo mejor de Colombia: la vibrante cultura bogotana con sus museos de clase mundial, la famosa Catedral de Sal de Zipaquirá, y la romántica ciudad amurallada de Cartagena con sus playas caribeñas, arquitectura colonial y una gastronomía que conquista todos los paladares.',
    'published',
    true,
    'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80',
    (SELECT id FROM public.destinations WHERE slug = 'bogota'),
    'Fácil',
    7,
    'Cultural',
    12,
    75,
    2,
    20,
    1599,
    '[{"day": 1, "title": "Llegada a Bogotá", "description": "Recepción y traslado al hotel en la Zona G o Chapinero. Noche libre."}, {"day": 2, "title": "Bogotá Colonial", "description": "Tour por La Candelaria, Plaza Bolívar, Museo del Oro y Museo Botero."}, {"day": 3, "title": "Zipaquirá", "description": "Excursión a la Catedral de Sal. Almuerzo típico colombiano en el pueblo."}, {"day": 4, "title": "Vuelo a Cartagena", "description": "Vuelo a Cartagena. Traslado al hotel en el centro histórico. Paseo por las murallas."}, {"day": 5, "title": "Cartagena Colonial", "description": "Tour por la ciudad amurallada: San Pedro Claver, Torre del Reloj, Getsemaní."}, {"day": 6, "title": "Islas del Rosario", "description": "Día de playa en las Islas del Rosario. Snorkel y almuerzo de mariscos."}, {"day": 7, "title": "Despedida", "description": "Mañana libre para compras. Traslado al aeropuerto."}]',
    '["Alojamiento 6 noches en hoteles boutique", "Desayunos diarios", "Vuelo interno Bogotá-Cartagena", "Traslados mencionados", "Excursión a Zipaquirá con entrada", "Tour Islas del Rosario con almuerzo", "Guías locales especializados"]',
    '["Vuelos internacionales", "Comidas no mencionadas", "Propinas", "Gastos personales"]'
),
(
    'Riviera Maya & Chichén Itzá',
    'riviera-maya-chichen-itza',
    'Playas paradisíacas y misterio maya',
    'Combina el relax en playas caribeñas con la exploración de antiguas ciudades mayas.',
    'El destino perfecto para quienes buscan sol, playa y cultura. Disfruta de las aguas turquesas del Caribe mexicano, nada en cenotes cristalinos, descubre la majestuosa pirámide de Kukulcán en Chichén Itzá y vive la magia de la Riviera Maya con su vibrante vida nocturna y exquisita gastronomía.',
    'published',
    true,
    'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=1200&q=80',
    (SELECT id FROM public.destinations WHERE slug = 'cancun'),
    'Fácil',
    6,
    'Playa',
    5,
    80,
    2,
    24,
    1399,
    '[{"day": 1, "title": "Llegada a Cancún", "description": "Recepción y traslado al resort all-inclusive en la Riviera Maya."}, {"day": 2, "title": "Playa & Relax", "description": "Día libre para disfrutar de las instalaciones del resort y la playa."}, {"day": 3, "title": "Chichén Itzá", "description": "Excursión a Chichén Itzá. Visita guiada y parada en cenote Ik Kil."}, {"day": 4, "title": "Tulum & Cenotes", "description": "Visita a las ruinas de Tulum frente al mar. Nado en cenote Dos Ojos."}, {"day": 5, "title": "Isla Mujeres", "description": "Excursión a Isla Mujeres. Snorkel y playa paradisíaca."}, {"day": 6, "title": "Despedida", "description": "Mañana de relax. Traslado al aeropuerto de Cancún."}]',
    '["Alojamiento 5 noches all-inclusive", "Todas las comidas y bebidas en resort", "Traslados aeropuerto-hotel-aeropuerto", "Excursión a Chichén Itzá", "Excursión a Tulum y cenotes", "Tour a Isla Mujeres"]',
    '["Vuelos", "Propinas", "Actividades opcionales", "Servicios de spa"]'
),
(
    'París Esencial',
    'paris-esencial',
    'La ciudad de las luces te espera',
    'Descubre los iconos de París: Torre Eiffel, Louvre, Montmartre y mucho más.',
    'Una semana en la ciudad más romántica del mundo. Desde la majestuosa Torre Eiffel hasta los tesoros del Louvre, desde los cafés de Saint-Germain hasta el bohemio Montmartre. Disfruta de la mejor gastronomía francesa, pasea por los Campos Elíseos y déjate seducir por la magia parisina.',
    'published',
    false,
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    (SELECT id FROM public.destinations WHERE slug = 'paris'),
    'Fácil',
    5,
    'Cultural',
    10,
    80,
    2,
    16,
    1899,
    '[{"day": 1, "title": "Bienvenue à Paris", "description": "Llegada a París. Traslado al hotel en Le Marais. Paseo de orientación."}, {"day": 2, "title": "París Clásico", "description": "Torre Eiffel con acceso a la cima. Crucero por el Sena. Campos Elíseos y Arco del Triunfo."}, {"day": 3, "title": "Arte & Historia", "description": "Museo del Louvre (visita guiada). Jardín de las Tullerías. Ópera Garnier."}, {"day": 4, "title": "Montmartre & Más", "description": "Sacré-Cœur y artistas de Montmartre. Tarde en Saint-Germain-des-Prés."}, {"day": 5, "title": "Au Revoir", "description": "Mañana libre para compras. Traslado al aeropuerto."}]',
    '["Alojamiento 4 noches hotel boutique céntrico", "Desayunos franceses diarios", "Traslados aeropuerto-hotel-aeropuerto", "Entrada Torre Eiffel con cima", "Entrada sin fila al Louvre", "Crucero por el Sena", "Guía en español"]',
    '["Vuelos internacionales", "Almuerzos y cenas", "Seguro de viaje", "Propinas"]'
),
(
    'Patagonia Extrema',
    'patagonia-extrema',
    'El fin del mundo te llama',
    'Trekking entre glaciares, lagos y las montañas más espectaculares del planeta.',
    'Una aventura para los amantes del trekking y la naturaleza en estado puro. Camina frente al imponente glaciar Perito Moreno, haz trekking en el Parque Nacional Los Glaciares, maravíllate con las Torres del Paine y navega entre icebergs. Paisajes que parecen de otro planeta en el fin del mundo.',
    'published',
    true,
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80',
    (SELECT id FROM public.destinations WHERE slug = 'patagonia'),
    'Intenso',
    8,
    'Aventura',
    18,
    60,
    4,
    12,
    3299,
    '[{"day": 1, "title": "Llegada a El Calafate", "description": "Vuelo desde Buenos Aires. Traslado al hotel. Briefing de la expedición."}, {"day": 2, "title": "Perito Moreno", "description": "Día completo en el glaciar Perito Moreno. Pasarelas y navegación cercana."}, {"day": 3, "title": "Minitrekking", "description": "Minitrekking sobre el glaciar Perito Moreno. Caminata de 2 horas sobre el hielo."}, {"day": 4, "title": "El Chaltén", "description": "Traslado a El Chaltén, capital argentina del trekking."}, {"day": 5, "title": "Laguna de los Tres", "description": "Trekking a la Laguna de los Tres con vista al Fitz Roy (10 horas)."}, {"day": 6, "title": "Laguna Torre", "description": "Trekking a la Laguna Torre frente al Cerro Torre (8 horas)."}, {"day": 7, "title": "Día de descanso", "description": "Día libre en El Chaltén. Opciones: trekking corto o descanso."}, {"day": 8, "title": "Regreso", "description": "Traslado a El Calafate. Vuelo de regreso a Buenos Aires."}]',
    '["Vuelos Buenos Aires-El Calafate-Buenos Aires", "Alojamiento 7 noches", "Desayunos y cenas", "Traslados terrestres", "Entrada Parque Nacional Los Glaciares", "Minitrekking glaciar", "Guía de montaña certificado"]',
    '["Almuerzos en trekking (llevar snacks)", "Equipo personal de trekking", "Propinas", "Seguro de montaña obligatorio"]'
);

-- Price Packages for tours
INSERT INTO public.price_packages (tour_id, name, description, adult_price, adult_crossed_price, adult_min_pax, child_price, child_age_min, child_age_max, is_default, sort_order) 
SELECT 
    t.id,
    'Habitación Doble',
    'Precio por persona en habitación doble compartida',
    t.base_price_usd,
    t.base_price_usd * 1.2,
    1,
    t.base_price_usd * 0.7,
    5,
    11,
    true,
    1
FROM public.tours t;

INSERT INTO public.price_packages (tour_id, name, description, adult_price, adult_crossed_price, adult_min_pax, child_price, child_age_min, child_age_max, is_default, sort_order) 
SELECT 
    t.id,
    'Habitación Individual',
    'Precio por persona en habitación individual',
    t.base_price_usd * 1.35,
    t.base_price_usd * 1.5,
    1,
    NULL,
    NULL,
    NULL,
    false,
    2
FROM public.tours t;

-- Tour Dates (próximos 3 meses)
INSERT INTO public.tour_dates (tour_id, start_date, end_date, max_participants, is_available)
SELECT 
    t.id,
    (CURRENT_DATE + (n * 14))::date,
    (CURRENT_DATE + (n * 14) + t.duration_days - 1)::date,
    t.group_size_max,
    true
FROM public.tours t
CROSS JOIN generate_series(1, 8) AS n
WHERE t.duration_days IS NOT NULL;

-- Tour Activities (assign activities to tours)
INSERT INTO public.tour_activities (tour_id, activity_id)
SELECT t.id, a.id FROM public.tours t, public.activities a WHERE t.slug = 'machu-picchu-valle-sagrado' AND a.slug IN ('cultural', 'historia', 'aventura');

INSERT INTO public.tour_activities (tour_id, activity_id)
SELECT t.id, a.id FROM public.tours t, public.activities a WHERE t.slug = 'galapagos-esencial' AND a.slug IN ('naturaleza', 'aventura', 'fotografia');

INSERT INTO public.tour_activities (tour_id, activity_id)
SELECT t.id, a.id FROM public.tours t, public.activities a WHERE t.slug = 'colombia-autentica' AND a.slug IN ('cultural', 'gastronomia', 'historia');

INSERT INTO public.tour_activities (tour_id, activity_id)
SELECT t.id, a.id FROM public.tours t, public.activities a WHERE t.slug = 'riviera-maya-chichen-itza' AND a.slug IN ('playa', 'historia', 'aventura');

INSERT INTO public.tour_activities (tour_id, activity_id)
SELECT t.id, a.id FROM public.tours t, public.activities a WHERE t.slug = 'paris-esencial' AND a.slug IN ('cultural', 'gastronomia', 'fotografia');

INSERT INTO public.tour_activities (tour_id, activity_id)
SELECT t.id, a.id FROM public.tours t, public.activities a WHERE t.slug = 'patagonia-extrema' AND a.slug IN ('aventura', 'naturaleza', 'fotografia');

-- Testimonials
INSERT INTO public.testimonials (name, text, image_url, tour_name, rating) VALUES
('María González', 'TravelCore hizo realidad nuestro sueño de conocer Galápagos. Todo perfectamente organizado, guías increíbles y experiencias que jamás olvidaremos. ¡100% recomendado!', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', 'Galápagos Esencial', 5),
('Carlos Rodríguez', 'Machu Picchu superó todas mis expectativas. El equipo de TravelCore se encargó de cada detalle, desde los hoteles hasta los guías locales. Una experiencia de vida.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 'Machu Picchu & Valle Sagrado', 5),
('Ana Martínez', 'Viajamos en familia a la Riviera Maya y fue mágico. Los niños disfrutaron los cenotes y nosotros la cultura maya. TravelCore hizo todo muy fácil.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 'Riviera Maya & Chichén Itzá', 5),
('Roberto Sánchez', 'La Patagonia es un destino que hay que vivir. TravelCore organizó una expedición perfecta, con guías expertos y logística impecable. Volveré seguro.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', 'Patagonia Extrema', 5);
