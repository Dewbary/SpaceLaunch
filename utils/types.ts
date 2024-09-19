
export type Launch = {
  id: string;
  net: string;
  launchData: LaunchData;
};

export type LaunchData = {
  id: string;
  name: string;
  pad: {
    latitude: number;
    longitude: number;
  };
  image: string;
  infoURLs: LaunchInfoUrl[];
  launch_service_provider: LaunchServiceProvider;
  mission: Mission
  rocket: Rocket
  status: LaunchStatus
};

export type LaunchStatus = {
  abbrev: string;
  description: string;
  name: string
}

export type Rocket = {
  configuration: RocketConfiguration;
}

export type RocketConfiguration = {
  description: string;
  family: string;
  full_name: string;
  image_url: string;
  info_url: string;
}

export type Mission = {
  description: string;
  name: string;
  type: string;
}

export type LaunchServiceProvider = {
  abbrev: string;
  country_code: string;
  founding_year: string;
  image_url: string;
  info_url: string;
  logo_url: string;
  name: string;
  spacecraft: string;
  type: string;
  wiki_url: string;
}

export type LaunchInfoUrl = {
  description: string;
  url: string;
}

export type LaunchGroup = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  groupSize: number;
  info: string;
};