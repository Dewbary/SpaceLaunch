import type { LaunchData } from "./types";

const GROUPING_DISTANCE_THRESHOLD = 50;

export const calculateLaunchGroups = (launches: LaunchData[]) => {
    const groups: LaunchData[][] = [];
    const used: Record<string, boolean> = {};

    launches.forEach((launch) => {
      if (used[launch.id]) return;
      const group = [launch];
      used[launch.id] = true;

      launches.forEach((l) => {
        if (used[l.id]) return;
        const dist = haversineDistance(
          launch.pad.latitude,
          launch.pad.longitude,
          l.pad.latitude,
          l.pad.longitude
        );
        if (dist < GROUPING_DISTANCE_THRESHOLD) {
          group.push(l);
          used[l.id] = true;
        }
      });
      groups.push(group);
    });

    return groups;
};
  
//returns a distance in kilometers
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const offsetLaunches = (group: LaunchData[]) => {
    const baseRadius = 0.5;
    const radiusIncrement = 0.09;
    const numRockets = group.length;

    group.forEach((rocket, index) => {
      if (numRockets > 1) {
        const angleStep = (2 * Math.PI) / numRockets;
        const angle = index * angleStep;
        const radius = baseRadius + index * radiusIncrement;
        const offsetX = radius * Math.cos(angle);
        const offsetY = radius * Math.sin(angle);

        // Update rocket lat/lng with the offset
        rocket.pad.latitude = (
          rocket.pad.latitude + offsetX
        );
        rocket.pad.longitude = (
          rocket.pad.longitude + offsetY
        );
      }
    });
  };