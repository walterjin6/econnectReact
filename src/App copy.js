import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, LoadScript, Polygon } from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

function App() {
    const [paths, setPaths] = useState([]);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCKEfoOIPz8l_6A8BByD3b3-ncwza8TNiA"
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])
    const handlePolygonComplete = (polygon) => {
        const paths = polygon.getPath().getArray().map((latLng) => {
            return {
                lat: latLng.lat(),
                lng: latLng.lng()
            };
        });
        setPaths(paths);
    };
    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onPolygonComplete={(polygon) => handlePolygonComplete(polygon)}
        >
            <Polygon
                paths={paths}
                editable={true}
                draggable={true}
                //onMouseUp={(e) => handlePolygonComplete(e)}
            />
        </GoogleMap>
    ) : <></>
}

export default React.memo(App)