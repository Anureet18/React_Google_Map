import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './App.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const containerStyle = {
  height: '300px',
  width: '100%',
  borderRadius: '8px',
};

const App = () => {
  const [searchInput, setSearchInput] = useState('');
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [address, setAddress] = useState('');

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const position = { lat: coords.latitude, lng: coords.longitude };
          setLocation(position);
          fetchAddress(position);
        },
        (error) => console.error('Error fetching current location:', error)
      );
    }
  }, []);

  const fetchAddress = ({ lat, lng }) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  };

  const handleMarkerDragEnd = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setLocation(newPosition);
    fetchAddress(newPosition);
  };

  const handleSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const newPosition = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        setLocation(newPosition);
        setAddress(results[0].formatted_address);
      } else {
        console.error('Address search failed:', status);
      }
    });
  };

  return (
    <div className="map-container">
      <h2>Google Map</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <p className="address-label">
        <strong>Current Location:</strong> {address}
      </p>

      {isLoaded && !loadError ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={14}
        >
          <Marker
            position={location}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      ) : (
        <div className="error-message">
          Error loading map. Please try again later.
        </div>
      )}
    </div>
  );
};

export default App;

// import React, { useState, useEffect } from 'react';
// import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
// import { IoMdArrowBack } from 'react-icons/io';

// const MapContainer = ({ onBackbtn }) => {
//   const [searchLocation, setSearchLocation] = useState('');
//   const [address, setAddress] = useState('');
//   const { isLoaded, loadError } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: 'AIzaSyDtUR0XMPK_K-8zT1WCWD4Pi37jA3e1bwc'
//   });

//   const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

//   console.log(searchLocation,"search")
//   console.log(currentLocation,"current")
//   console.log(address,"add-ress")

//   useEffect(() => {
//     getCurrentLocation();
//   },[]);

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         position => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({
//             lat: latitude,
//             lng: longitude
//           });
//           getAddressFromCoordinates(latitude, longitude);
//         },
//         error => {
//           console.error('Error getting current location:', error);
//         }
//       );
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
//   };

//   const getAddressFromCoordinates = (latitude, longitude) => {
//     const geocoder = new window.google.maps.Geocoder();
//     const latLng = { lat: latitude, lng: longitude };
//     geocoder.geocode({ location: latLng }, (results, status) => {
//       if (status === 'OK') {
//         if (results[0]) {
//           setAddress(results[0].formatted_address);
//         } else {
//           console.error('No results found');
//         }
//       } else {
//         console.error('Geocode was not successful for the following reason: ' + status);
//       }
//     });
//   };

//   const handleMarkerDrag = event => {
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
//     setCurrentLocation({ lat, lng });
//     getAddressFromCoordinates(lat, lng);
//   };

//   const handleSearchLocation = () => {
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ address: searchLocation }, (results, status) => {
//       if (status === 'OK') {
//         if (results[0]) {
//           setCurrentLocation({
//             lat: results[0].geometry.location.lat(),
//             lng: results[0].geometry.location.lng()
//           });
//           setAddress(results[0].formatted_address);
//         } else {
//           console.error('No results found');
//         }
//       } else {
//         console.error('Geocode was not successful for the following reason: ' + status);
//       }
//     });
//   };

//   return (
//     <div>
//       <div className="enter-head mb-3">
//         <IoMdArrowBack onClick={onBackbtn} />
//         <h5>Location</h5>
//         <p></p>
//       </div>
//       <input
//         type="text"
//         placeholder="Search location..."
//         value={searchLocation}
//         onChange={e => setSearchLocation(e.target.value)}
//       />
//       <button onClick={handleSearchLocation}>Search</button>
//       <p>Current Location: {address}</p>
//       {isLoaded && !loadError && (
//         <MapWithMarker currentLocation={currentLocation} onMarkerDrag={handleMarkerDrag} />
//       )}
//       {loadError && <div>Error loading map. Please try again later.</div>
//       }
//     </div>
//   );
// };

// const MapWithMarker = ({ currentLocation, onMarkerDrag }) => {
//   const mapStyles = {
//     height: '400px',
//     width: '100%'
//   };

//   const defaultCenter = {
//     lat: 0,
//     lng: 0
//   };

//   const onLoad = React.useCallback(function onLoadCallback(map) {
//     const bounds = new window.google.maps.LatLngBounds(defaultCenter);
//     map.fitBounds(bounds);
//   }, []);

//   const onUnmount = React.useCallback(function onUnmountCallback(map) {}, []);

//   return (
//     <GoogleMap
//       mapContainerStyle={mapStyles}
//       center={currentLocation}
//       zoom={10}
//       onLoad={onLoad}
//       onUnmount={onUnmount}
//     >
//       <Marker
//         position={currentLocation}
//         draggable={true}
//         onDragEnd={onMarkerDrag}
//       />
//     </GoogleMap>
//   );
// };

// export default MapContainer;