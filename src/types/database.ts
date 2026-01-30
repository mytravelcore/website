export interface Destination {
  id: string;
  name: string;
  slug: string | null;
  country: string;
  region: string | null;
  short_description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  // GCS Image fields
  image_url: string | null;
  image_storage_path: string | null;
  gallery_image_urls: string[] | null;
  gallery_image_storage_paths: string[] | null;
  parent_id: string | null;
  parent?: Destination | null;
  children?: Destination[];
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  icon: string | null;
  // GCS Image fields
  image_url: string | null;
  image_storage_path: string | null;
  gallery_image_urls: string[] | null;
  gallery_image_storage_paths: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface TourDestination {
  id: string;
  tour_id: string;
  destination_id: string;
  destination?: Destination;
  created_at: string;
}

export interface TourActivity {
  id: string;
  tour_id: string;
  activity_id: string;
  activity?: Activity;
  created_at: string;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  price_usd: number | null;
  duration_days: number | null;
  difficulty: 'Fácil' | 'Moderado' | 'Intenso' | null;
  destination_id: string | null;
  category: string | null;
  start_dates: string[];
  featured: boolean;
  // GCS Image fields
  hero_image_url: string | null;
  hero_image_storage_path: string | null;
  gallery_image_urls: string[];
  gallery_image_storage_paths: string[];
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  created_at: string;
  updated_at: string;
  destination?: Destination;
  // New booking-related fields
  status?: 'draft' | 'published' | 'archived';
  subtitle?: string | null;
  age_range?: string | null;
  destination_label?: string | null;
  difficulty_label?: string | null;
  activities_label?: string | null;
  group_size_label?: string | null;
  starting_price_from?: number | null;
  currency?: string;
  // Tour details fields
  destination_name?: string | null;
  difficulty_level?: string | null;
  age_min?: number | null;
  age_max?: number | null;
  group_size_min?: number | null;
  group_size_max?: number | null;
  tour_label?: string | null;
  // Price packages fields
  package_type?: 'single' | 'multiple' | null;
  primary_price_category?: string | null;
  price_packages?: PricePackage[] | null;
  // Relations
  packages?: PricingPackage[];
  tour_dates?: TourDate[];
  tour_destinations?: TourDestination[];
  tour_activities?: TourActivity[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface PricingPackage {
  id: string;
  tour_id: string;
  name: string;
  package_type: 'single' | 'multiple' | null;
  primary_category: 'adult' | 'child' | null;
  price: number;
  currency: string;
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
  is_available: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  date_packages?: TourDatePackage[];
}

export interface TourDatePackage {
  id: string;
  tour_date_id: string;
  package_id: string;
  override_price: number | null;
  available_units: number | null;
  created_at: string;
}

export interface TourItineraryItem {
  id: string;
  tour_id: string;
  day_number: number;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TourBullet {
  id: string;
  tour_id: string;
  type: 'include' | 'exclude';
  text: string;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  image_url: string | null;
  source: string | null;
  rating: number;
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

// Price package for tour pricing - supports single or multiple packages
export interface PricePackage {
  id: string;
  name: string; // "Habitación Doble", "Habitación Triple", "Habitación Sencilla"
  isDefault: boolean;
  // Adult pricing
  adultSellingPrice: number;
  adultCrossedPrice: number | null; // Original price (tachado)
  adultMinPax: number;
  adultMaxPax: number | null; // null = unlimited
  // Child pricing
  childSellingPrice: number;
  childCrossedPrice: number | null;
  childMinPax: number;
  childMaxPax: number | null;
  childAgeMin: number;
  childAgeMax: number;
  // Group discount
  groupDiscountEnabled: boolean;
  groupDiscountPercentage: number | null;
  groupDiscountMinPax: number | null;
}

// Tour date types
export interface TourDate {
  id: string;
  tour_id: string;
  starting_date: string;
  cutoff_days: number;
  max_pax: number | null;
  repeat_enabled: boolean;
  repeat_pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  repeat_until: string | null;
  created_at: string;
  package_overrides?: TourDatePackage[];
}

export interface TourDatePackage {
  id: string;
  tour_date_id: string;
  package_id: string;
  enabled: boolean;
  price_override: number | null;
  max_pax_override: number | null;
  notes: string | null;
  blocked_dates?: TourDateBlockedDate[];
}

export interface TourDateBlockedDate {
  id: string;
  tour_date_package_id: string;
  blocked_date: string;
}
