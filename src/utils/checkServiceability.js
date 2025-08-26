const axios = require('axios');
const Address = require('../models/address');
const serviceableAreas = require('../models/serviceableAreas');

async function getLocationDetailsFromCoords(lat, long, apiKey) {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`
        );

        if (response.data.status === 'OK') {
            const result = response.data.results[0];
            let pincode = '', city = '';

            // Extract postal code and city
            for (let component of result.address_components) {
                if (component.types.includes('postal_code')) {
                    pincode = component.long_name;
                }
                if (component.types.includes('locality')) {
                    city = component.long_name;
                }
            }

            return { pincode, city };
        }
        return { pincode: '', city: '' };
    } catch (error) {
        console.error('Error getting location details:', error);
        return { pincode: '', city: '' };
    }
}

async function checkServiceability(userId, userCoords, apiKey, service) {
    try {
        // console.log('Checking serviceability for:', { userId, userCoords, service });

        // First try to get from default address
        const address = await Address.findOne({ userId, isDefault: true });
        // console.log('Found address:', address);

        let pincode;

        if (address && address.pincode) {
            pincode = address.pincode;
        } else if (userCoords.lat && userCoords.long) {
            // If no address, get pincode from coordinates
            const locationDetails = await getLocationDetailsFromCoords(
                userCoords.lat,
                userCoords.long,
                apiKey
            );
            pincode = locationDetails.pincode;
        }

        if (!pincode) {
            return false;
        }

        // Build the filter object
        let filter = {
            pincode,
            status: "active" // Add status check
        };

        if (service === 'food') {
            filter.isFoodAvailable = true;
        } else if (service === 'grocery') {
            filter.isGroceryAvailable = true;
        }

        // Check if pincode is serviceable
        const serviceable = await serviceableAreas.findOne(filter); // Remove the extra curly braces

        return !!serviceable;
    } catch (error) {
        console.error('Error checking serviceability:', error);
        return false;
    }
}

module.exports = checkServiceability;
