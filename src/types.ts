export interface HouseData {
  price: number;
  area_sqft: number;
  city: string;
  thana: string;
  bedrooms: number;
  bathrooms: number;
  floor_level: number;
  total_floors: number;
  building_age: number;
  lift: boolean;
  gas_line: boolean;
  airco: boolean;
  generator: boolean;
  security: boolean;
  parking: boolean;
  garagepl: boolean;
  road_width_ft: number;
  distance_main_road_m: number;
  near_school: boolean;
  near_hospital: boolean;
  near_market: boolean;
  driveway: boolean;
  fullbase: boolean;
  prefarea: boolean;
}

export type PredictionInput = Omit<HouseData, 'price'>;
