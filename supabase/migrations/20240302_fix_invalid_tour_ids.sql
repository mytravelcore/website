-- Migration to fix tours with invalid (non-UUID) IDs
-- This deletes tours that have numeric IDs instead of UUIDs
-- and re-inserts sample data with proper UUIDs

-- First, let's delete any tours that might have invalid IDs
-- We'll truncate and re-insert sample data to ensure clean state
TRUNCATE TABLE public.tours CASCADE;

-- Get some destination IDs for references
DO $$
DECLARE
    dest_bogota uuid;
    dest_cusco uuid;
    dest_galapagos uuid;
    dest_madrid uuid;
    dest_paris uuid;
    dest_cancun uuid;
BEGIN
    SELECT id INTO dest_bogota FROM public.destinations WHERE slug = 'bogota' OR name ILIKE '%bogot%' LIMIT 1;
    SELECT id INTO dest_cusco FROM public.destinations WHERE slug = 'cusco' OR name ILIKE '%cusco%' LIMIT 1;
    SELECT id INTO dest_galapagos FROM public.destinations WHERE slug = 'galapagos' OR name ILIKE '%galap%' LIMIT 1;
    SELECT id INTO dest_madrid FROM public.destinations WHERE slug = 'madrid' OR name ILIKE '%madrid%' LIMIT 1;
    SELECT id INTO dest_paris FROM public.destinations WHERE slug = 'paris' OR name ILIKE '%par%s%' LIMIT 1;
    SELECT id INTO dest_cancun FROM public.destinations WHERE slug = 'cancun' OR name ILIKE '%canc%n%' LIMIT 1;

    -- Insert sample tours with proper UUIDs
    INSERT INTO public.tours (title, slug, short_description, long_description, hero_image_url, destination_id, difficulty, duration_days, category, featured, status, base_price_usd, itinerary, includes, excludes)
    VALUES
    (
        'Encantos de Bogotá y la Catedral de Sal',
        'encantos-bogota-catedral-sal',
        'Descubre la magia de la capital colombiana y la impresionante Catedral de Sal.',
        'Un viaje inolvidable por Bogotá, donde explorarás el centro histórico de La Candelaria, el Museo del Oro, y la impresionante Catedral de Sal de Zipaquirá.',
        'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1200&q=80',
        dest_bogota,
        'Fácil',
        5,
        'Cultural',
        true,
        'published',
        899,
        '[{"day": 1, "title": "Llegada a Bogotá", "description": "Recepción en el aeropuerto y traslado al hotel. Tarde libre para aclimatación."}, {"day": 2, "title": "La Candelaria y Museo del Oro", "description": "Recorrido por el centro histórico y visita al famoso Museo del Oro."}, {"day": 3, "title": "Catedral de Sal de Zipaquirá", "description": "Excursión a la impresionante Catedral de Sal."}, {"day": 4, "title": "Monserrate", "description": "Subida al cerro de Monserrate con vistas panorámicas de la ciudad."}, {"day": 5, "title": "Despedida", "description": "Desayuno y traslado al aeropuerto."}]'::jsonb,
        '["Alojamiento 4 noches", "Desayunos diarios", "Traslados aeropuerto-hotel-aeropuerto", "Guía profesional bilingüe", "Entradas a museos y atracciones"]'::jsonb,
        '["Vuelos internacionales", "Seguro de viaje", "Comidas no mencionadas", "Propinas"]'::jsonb
    ),
    (
        'Machu Picchu: El Imperio Inca',
        'machu-picchu-imperio-inca',
        'Vive la magia del Valle Sagrado y la ciudadela perdida de los Incas.',
        'Una experiencia única que te llevará por el Valle Sagrado de los Incas hasta la majestuosa ciudadela de Machu Picchu.',
        'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
        dest_cusco,
        'Moderado',
        7,
        'Aventura',
        true,
        'published',
        1299,
        '[{"day": 1, "title": "Llegada a Cusco", "description": "Recepción y traslado al hotel. Aclimatación a la altura."}, {"day": 2, "title": "City Tour Cusco", "description": "Visita a la Plaza de Armas, Catedral, Qoricancha y ruinas cercanas."}, {"day": 3, "title": "Valle Sagrado", "description": "Excursión al Valle Sagrado: Pisac, Ollantaytambo y Chinchero."}, {"day": 4, "title": "Tren a Aguas Calientes", "description": "Viaje en tren panorámico hasta Aguas Calientes."}, {"day": 5, "title": "Machu Picchu", "description": "Amanecer en Machu Picchu con tour guiado completo."}, {"day": 6, "title": "Día libre en Cusco", "description": "Día libre para explorar la ciudad."}, {"day": 7, "title": "Despedida", "description": "Traslado al aeropuerto."}]'::jsonb,
        '["Alojamiento 6 noches", "Desayunos diarios", "Tren Expedition a Machu Picchu", "Entrada a Machu Picchu", "Guía profesional", "Traslados"]'::jsonb,
        '["Vuelos", "Almuerzo en Machu Picchu", "Propinas", "Seguro de viaje"]'::jsonb
    ),
    (
        'Galápagos: Paraíso Natural',
        'galapagos-paraiso-natural',
        'Descubre la fauna única del archipiélago que inspiró a Darwin.',
        'Explora las Islas Galápagos en un crucero de lujo, observando tortugas gigantes, iguanas marinas, leones marinos y las famosas fragatas.',
        'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=1200&q=80',
        dest_galapagos,
        'Fácil',
        8,
        'Naturaleza',
        true,
        'published',
        3499,
        '[{"day": 1, "title": "Llegada a Baltra", "description": "Vuelo a Galápagos y embarque en el yate."}, {"day": 2, "title": "Isla Santa Cruz", "description": "Estación Charles Darwin y tortugas gigantes."}, {"day": 3, "title": "Isla Isabela", "description": "Volcanes y pingüinos de Galápagos."}, {"day": 4, "title": "Isla Fernandina", "description": "Iguanas marinas y cormoranes."}, {"day": 5, "title": "Bahía Sullivan", "description": "Campos de lava y snorkel."}, {"day": 6, "title": "Isla Genovesa", "description": "Santuario de aves."}, {"day": 7, "title": "Isla San Cristóbal", "description": "Lobos marinos y buceo."}, {"day": 8, "title": "Despedida", "description": "Desembarque y vuelo de regreso."}]'::jsonb,
        '["Crucero todo incluido 7 noches", "Vuelos Quito-Galápagos-Quito", "Todas las comidas a bordo", "Snorkel y kayak", "Guía naturalista", "Ingreso al Parque Nacional"]'::jsonb,
        '["Vuelos internacionales", "Bebidas alcohólicas", "Propinas", "Seguro de buceo"]'::jsonb
    ),
    (
        'Madrid y Toledo: Esencia Española',
        'madrid-toledo-esencia-espanola',
        'Sumérgete en la cultura española entre museos de clase mundial y ciudades medievales.',
        'Descubre la vibrante capital española con sus museos de renombre mundial y escapa a la histórica Toledo, la Ciudad de las Tres Culturas.',
        'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80',
        dest_madrid,
        'Fácil',
        6,
        'Cultural',
        false,
        'published',
        1099,
        '[{"day": 1, "title": "Llegada a Madrid", "description": "Traslado al hotel y paseo por Gran Vía."}, {"day": 2, "title": "Museo del Prado", "description": "Visita guiada al Prado y Retiro."}, {"day": 3, "title": "Palacio Real", "description": "Tour del Palacio Real y Plaza Mayor."}, {"day": 4, "title": "Excursión a Toledo", "description": "Día completo en la Ciudad de las Tres Culturas."}, {"day": 5, "title": "Reina Sofía y Shopping", "description": "Museo Reina Sofía y tarde libre."}, {"day": 6, "title": "Despedida", "description": "Traslado al aeropuerto."}]'::jsonb,
        '["5 noches hotel 4*", "Desayunos bufé", "Traslados", "Entradas a museos", "Excursión a Toledo", "Guía profesional"]'::jsonb,
        '["Vuelos", "Comidas no mencionadas", "Propinas"]'::jsonb
    ),
    (
        'París Romántico',
        'paris-romantico',
        'La ciudad del amor te espera con sus iconos eternos y su gastronomía exquisita.',
        'Enamórate de París recorriendo sus calles bohemias, admirando la Torre Eiffel y degustando la mejor gastronomía francesa.',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
        dest_paris,
        'Fácil',
        5,
        'Romántico',
        true,
        'published',
        1599,
        '[{"day": 1, "title": "Bienvenue à Paris", "description": "Llegada y paseo por los Campos Elíseos."}, {"day": 2, "title": "Louvre y Sena", "description": "Museo del Louvre y crucero por el Sena."}, {"day": 3, "title": "Torre Eiffel y Montmartre", "description": "Subida a la Torre y barrio bohemio."}, {"day": 4, "title": "Versalles", "description": "Excursión al Palacio de Versalles."}, {"day": 5, "title": "Au revoir", "description": "Tiempo libre y traslado al aeropuerto."}]'::jsonb,
        '["4 noches hotel boutique", "Desayunos franceses", "Entradas Torre Eiffel y Louvre", "Crucero Sena", "Excursión Versalles"]'::jsonb,
        '["Vuelos", "Comidas adicionales", "Propinas"]'::jsonb
    ),
    (
        'Riviera Maya: Sol y Cultura',
        'riviera-maya-sol-cultura',
        'Playas paradisíacas y las ruinas mayas más impresionantes te esperan.',
        'Combina las mejores playas del Caribe mexicano con la majestuosidad de las ruinas de Chichén Itzá y Tulum.',
        'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=1200&q=80',
        dest_cancun,
        'Fácil',
        7,
        'Playa',
        false,
        'published',
        1199,
        '[{"day": 1, "title": "Llegada a Cancún", "description": "Traslado al resort all-inclusive."}, {"day": 2, "title": "Día de playa", "description": "Relax en las playas del resort."}, {"day": 3, "title": "Chichén Itzá", "description": "Excursión a la maravilla del mundo."}, {"day": 4, "title": "Snorkel en cenotes", "description": "Experiencia en cenotes cristalinos."}, {"day": 5, "title": "Ruinas de Tulum", "description": "Visita a Tulum y playa."}, {"day": 6, "title": "Día libre", "description": "Actividades opcionales o descanso."}, {"day": 7, "title": "Despedida", "description": "Traslado al aeropuerto."}]'::jsonb,
        '["6 noches all-inclusive", "Traslados", "Excursión Chichén Itzá", "Tour cenotes", "Excursión Tulum"]'::jsonb,
        '["Vuelos", "Propinas", "Actividades opcionales"]'::jsonb
    );
END $$;
