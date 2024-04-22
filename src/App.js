import React, { useState, useRef, useCallback } from "react";
import { LoadScript, GoogleMap, Polygon } from "@react-google-maps/api";
import "./styles.css";
import axios from "axios";

function App() {
    const [path, setPath] = useState([
        { lat: 52.52549080781086, lng: 13.398118538856465 },
        { lat: 52.48578559055679, lng: 13.36653284549709 },
        { lat: 52.48871246221608, lng: 13.44618372440334 }
    ]);

    // Define refs for Polygon instance and listeners
    const polygonRef = useRef(null);
    const listenersRef = useRef([]);

    // Call setPath with new edited path
    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map(latLng => `${latLng.lat()},${latLng.lng()}`).join(',');
            setPath(nextPath);
            axios.post('http://20.92.124.226:8081/address/rest/address/polygonSearch', {
                "arf": "GNAF",
                "geocodes": "LatLong.Latitude+Longitude+Reliability",
                "polygon": nextPath,
                "start": nextPath.split(',')[0],
                "point": null,
                "range": null,
                "properties": {
                    "delimiter": "|"
                },
                "f": "fulljson",
                "shuffle": 0
            }, {
                timeout: 10000  // Timeout after 5 seconds
            })
                .then(response => {
                    console.log('Polygon updated successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error updating polygon:', error);
                });
        }
    }, [setPath]);

    // Bind refs to current Polygon and listeners
    const onLoad = useCallback(
        polygon => {
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listenersRef.current.push(
                path.addListener("set_at", onEdit),
                path.addListener("insert_at", onEdit),
                path.addListener("remove_at", onEdit)
            );
        },
        [onEdit]
    );

    // Clean up refs
    const onUnmount = useCallback(() => {
        listenersRef.current.forEach(lis => lis.remove());
        polygonRef.current = null;
    }, []);

    console.log("The path state is", path);

    return (
        <div className="App">1111111111111111111111111111111111111111111111111
            <LoadScript
                id="script-loader"
                googleMapsApiKey="AIzaSyCKEfoOIPz8l_6A8BByD3b3-ncwza8TNiA"
                language="en"
                region="us"
            >
                <GoogleMap
                    mapContainerClassName="App-map"
                    center={{ lat: 52.52047739093263, lng: 13.36653284549709 }}
                    zoom={12}
                    version="weekly"
                    on
                >
                    <Polygon
                        // Make the Polygon editable / draggable
                        editable
                        draggable
                        path={path}
                        onMouseUp={onEdit}
                        onDragEnd={onEdit}
                        // Event used when manipulating and adding points
                        onMouseUp={onEdit}
                        // Event used when dragging the whole Polygon
                        onDragEnd={onEdit}
                        onLoad={onLoad}
                        onUnmount={onUnmount}

                    />
                </GoogleMap>
            </LoadScript>
        </div>
    );
}

export default React.memo(App)