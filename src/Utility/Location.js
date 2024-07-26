const GOOGLE_API_KEY = '';

export async function getAddressFomCoords(coords){
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lat}&key=${GOOGLE_API_KEY}`);
    if(!response.ok){
        throw new Error('Failed to catch coordinates');
    }
    const data = await response.json();
    if(data.error_message){
        throw new Error(data.error_message);
    }
    const address = data.results[0].formatted_address;
    return address;
}

export async function getCoordsFromAddress(address){
    const urlAddress = encodeURI(address);
    //Geocoding API
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`);
    if(!response.ok){
        throw new Error('Failed to catch coordinates');
    }
    const data = await response.json();
    if(data.error_message){
        throw new Error(data.error_message);
    }

    console.log(data);
    const coordinates = data.results[0].geometry.location;
    return coordinates;
} 