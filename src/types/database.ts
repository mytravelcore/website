// TravelCore Database Types

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  short_description: string | null;
  long_description: string | null;
  image_url: string | null;
  hero_image_url: string | null;
  gallery_images: string[];
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TourActivity {
  id: string;
  tour_id: string;
  activity_id: string;
  activity?: Activity;
  created_at: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Tour {
  id: string;
  // Basic Info
  title: string;
  slug: string;
  subtitle: string | null;
  short_description: string | null;
  long_description: string | null;
  // Status
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  // Images
  hero_image_url: string | null;
  gallery_images: string[];
  gallery_image_urls?: string[];
  // Tour Details
  destination_id: string | null;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil' | 'Intenso' | null;
  difficulty_level?: string | null;
  duration_days: number | null;
  category: string | null;
  // Age & Group
  age_min: number | null;
  age_max: number | null;
  age_range?: string | null;
  group_size_min: number | null;
  group_size_max: number | null;
  // Pricing
  base_price_usd: number | null;
  price_usd?: number | null;
  currency: string;
  // Content
  itinerary: ItineraryDay[];
  itinerary_days?: ItineraryDay[];
  includes: string[];
  excludes: string[];
  faqs: FAQ[];
  // Package/Pricing config
  package_type?: 'single' | 'multiple';
  primary_price_category?: string;
  price_packages?: PricePackage[];
  starting_price_from?: number | null;
  // Timestamps
  created_at: string;
  updated_at: string;
  // Relations
  destination?: Destination;
  tour_activities?: TourActivity[];
  tour_dates?: TourDate[];
  // Label fields
  destination_label?: string | null;
  difficulty_label?: string | null;
  activities_label?: string | null;
  group_size_label?: string | null;
}

export interface PricePackage {
  id: string;
  tour_id: string;
  name: string;
  description: string | null;
  // Adult pricing
  adult_price: number;
  adult_crossed_price: number | null;
  adult_min_pax: number;
  adult_max_pax: number | null;
  // Child pricing
  child_price: number | null;
  child_crossed_price: number | null;
  child_min_pax: number;
  child_max_pax: number | null;
  child_age_min: number | null;
  child_age_max: number | null;
  // Group discount
  group_discount_enabled: boolean;
  group_discount_percentage: number | null;
  group_discount_min_pax: number | null;
  // Status
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TourDate {
  id: string;
  tour_id: string;
  start_date: string;
  end_date: string | null;
  max_participants: number | null;
  is_available: boolean;
  notes: string | null;
  // Repeat settings
  repeat_enabled: boolean;
  repeat_pattern: 'daily' | 'weekly' | 'monthly' | null;
  repeat_until: string | null;
  created_at: string;
  updated_at: string;
  // Relationships
  date_packages?: TourDatePackage[];
}

export interface TourDatePackage {
  id: string;
  tour_date_id: string;
  package_id: string;
  enabled: boolean;
  price_override: number | null;
  max_pax_override: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  label?: string;
  isDefault: boolean;
  adultPrice: number;
  adultSingleSupplement?: number;
  childPrice?: number;
  childAgeMin?: number;
  childAgeMax?: number;
  infantPrice?: number;
  infantAgeMax?: number;
  details?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  image_url: string | null;
  tour_name: string | null;
  rating: number;
  source?: string | null;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  trip_type: string | null;
  message: string | null;
  created_at: string;
}

// Form types for creating/editing
export interface TourFormData {
  title: string;
  slug: string;
  subtitle?: string;
  short_description?: string;
  long_description?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  hero_image_url?: string;
  gallery_images: string[];
  destination_id?: string;
  difficulty?: 'Fácil' | 'Moderado' | 'Difícil' | 'Intenso';
  duration_days?: number;
  category?: string;
  age_min?: number;
  age_max?: number;
  group_size_min?: number;
  group_size_max?: number;
  base_price_usd?: number;
  currency: string;
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  faqs: FAQ[];
}

export interface DestinationFormData {
  name: string;
  slug: string;
  country: string;
  region?: string;
  short_description?: string;
  long_description?: string;
  image_url?: string;
  gallery_images: string[];
}

export interface ActivityFormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
}
