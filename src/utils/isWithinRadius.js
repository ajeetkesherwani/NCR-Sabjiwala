import axios from "axios";

export async function isWithinRadius(origin, destination, apiKey, maxDistanceKm = 5) {
    // console.log(origin)
    // console.log(destination)
    // console.log(apiKey)
    // console.log(maxDistanceKm)
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.long}&destinations=${destination.lat},${destination.long}&key=${apiKey}`;

    const response = await axios.get(url);
    const element = response.data.rows[0].elements[0];
    // console.log(url)
    if (element.status !== "OK") throw new Error("Distance data not available");

    const distanceInMeters = element.distance.value;
    const distanceInKm = distanceInMeters / 1000;
    // console.log(distanceInKm)

    return distanceInKm <= maxDistanceKm;
}