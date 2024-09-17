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
};

export type LaunchGroup = {
  lat: number;
  lng: number;
  label: string;
  groupSize: number;
  info: string;
};