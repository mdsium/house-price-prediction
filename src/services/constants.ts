export const CITY_THANA_MAP: Record<string, string[]> = {
  "Dhaka": [
    "Gulshan-1", "Gulshan-2", "Banani", "Dhanmondi", "Uttara", "Mirpur-1", 
    "Mirpur-10", "Shyamoli", "Rayer Bazar", "Tejgaon", "Mohammadpur", "Bashundhara"
  ],
  "Chattogram": [
    "Pahartali", "Nasirabad", "GEC Circle", "Agrabad", "Halishahar", "Muradpur"
  ],
  "Rajshahi": [
    "Motihar", "Boalia", "Poba", "Rajpara", "Shah Makhdum"
  ],
  "Sylhet": [
    "Amberkhana", "Shahjalal", "Sylhet Sadar", "Zindabazar", "Uposhohor"
  ]
};

export const THANA_CENTERS: Record<string, { lat: number, lng: number }> = {
  "Gulshan-1": { lat: 23.7770, lng: 90.4130 },
  "Gulshan-2": { lat: 23.7937, lng: 90.4143 },
  "Banani": { lat: 23.7915, lng: 90.4042 },
  "Dhanmondi": { lat: 23.7461, lng: 90.3742 },
  "Uttara": { lat: 23.8759, lng: 90.3795 },
  "Mirpur-1": { lat: 23.7956, lng: 90.3537 },
  "Mirpur-10": { lat: 23.8069, lng: 90.3687 },
  "Shyamoli": { lat: 23.7744, lng: 90.3652 },
  "Rayer Bazar": { lat: 23.7423, lng: 90.3644 },
  "Tejgaon": { lat: 23.7603, lng: 90.3906 },
  "Mohammadpur": { lat: 23.7658, lng: 90.3584 },
  "Bashundhara": { lat: 23.8190, lng: 90.4357 },
  
  "Pahartali": { lat: 22.3614, lng: 91.7850 },
  "Nasirabad": { lat: 22.3571, lng: 91.8234 },
  "GEC Circle": { lat: 22.3592, lng: 91.8206 },
  "Agrabad": { lat: 22.3275, lng: 91.8123 },
  "Halishahar": { lat: 22.3168, lng: 91.7772 },
  "Muradpur": { lat: 22.3697, lng: 91.8329 },
  
  "Motihar": { lat: 24.3641, lng: 88.6310 },
  "Boalia": { lat: 24.3685, lng: 88.6111 },
  "Poba": { lat: 24.4284, lng: 88.6047 },
  "Rajpara": { lat: 24.3727, lng: 88.5831 },
  "Shah Makhdum": { lat: 24.3942, lng: 88.6080 },
  
  "Amberkhana": { lat: 24.9038, lng: 91.8665 },
  "Shahjalal": { lat: 24.8949, lng: 91.8687 },
  "Sylhet Sadar": { lat: 24.9189, lng: 91.8080 },
  "Zindabazar": { lat: 24.8953, lng: 91.8690 },
  "Uposhohor": { lat: 24.8821, lng: 91.8845 }
};

export const SAMPLE_HOUSE_DATA = [
  { price: 33440000, area_sqft: 1726, city: "Dhaka", thana: "Gulshan-1", lat: 23.7770, lng: 90.4130 },
  { price: 15330000, area_sqft: 922, city: "Dhaka", thana: "Dhanmondi", lat: 23.7461, lng: 90.3742 },
  { price: 43540000, area_sqft: 2167, city: "Dhaka", thana: "Banani", lat: 23.7915, lng: 90.4042 },
  { price: 20860000, area_sqft: 2119, city: "Dhaka", thana: "Uttara", lat: 23.8759, lng: 90.3795 },
  { price: 25550000, area_sqft: 2299, city: "Chattogram", thana: "Agrabad", lat: 22.3275, lng: 91.8123 },
  { price: 25630000, area_sqft: 2588, city: "Chattogram", thana: "Nasirabad", lat: 22.3571, lng: 91.8234 },
  { price: 9300000, area_sqft: 1800, city: "Rajshahi", thana: "Boalia", lat: 24.3685, lng: 88.6111 },
  { price: 11820000, area_sqft: 1331, city: "Sylhet", thana: "Shahjalal", lat: 24.8949, lng: 91.8687 },
  { price: 23350000, area_sqft: 2644, city: "Sylhet", thana: "Amberkhana", lat: 24.9038, lng: 91.8665 },
];
