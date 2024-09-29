import { MarkerDetails } from '@/app/page';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import React from 'react';
import MapSheet from './MapSheet';

interface userLocation {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: '95vh',
};

const center = {
  lat: 43.65107, // Central latitude of Toronto
  lng: -79.347015, // Central longitude of Toronto
};

const torontoBounds = {
  north: 43.855401, // Northern boundary near Vaughan
  south: 43.581024, // Southern boundary near Lake Ontario
  west: -79.639219, // Western boundary near Mississauga
  east: -79.116897, // Eastern boundary near Scarborough/Pickering
};

const options = {
  restriction: {
    latLngBounds: torontoBounds,
    strictBounds: true,
  },
};

interface MapProps {
  markers?: MarkerDetails[];
}

const Map: React.FC<MapProps> = ({ markers }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAPS_API ||
      'AIzaSyBF_kCwkH7r0-45lFxzulNbbqNZGYeLWv8',
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null); // eslint-disable-line
  const [userLocation, setUserLocation] = React.useState<userLocation | null>();

  const success = (position: GeolocationPosition) => {
    console.log(position);
    setUserLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  };

  const error = (error: GeolocationPositionError) => {
    console.log(error);
  };

  const onLoad = React.useCallback((map: google.maps.Map) => {
    map.fitBounds(torontoBounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const [selectedContent, setSelectedContent] =
    React.useState<MarkerDetails | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleMarkerClick = (content: MarkerDetails) => {
    setSelectedContent(content); // Set the selected content to be displayed in the sheet
    setIsSheetOpen(true); // Open the sheet
  };

  const handleClose = () => {
    setSelectedContent(null); // Reset the selected content when closing
    setIsSheetOpen(false); // Close the sheet
  };

  const [markersLoaded, setMarkersLoaded] = React.useState(false);

  React.useEffect(() => {
    if (markers && markers.length > 0) {
      navigator.geolocation.getCurrentPosition(success, error);
      setMarkersLoaded(true); // Markers are now loaded
    }
  }, [markers]);

  React.useEffect(() => {
    if (map && markersLoaded && markers && userLocation) {
      const { lat, lng } = userLocation;

      if (lat !== undefined && lng !== undefined) {
        // Ensure both lat and lng are defined
        if (map.getZoom() !== 14) {
          map.setZoom(14);
        }
        map.panTo({ lat, lng });
      }
    }
  }, [map, markersLoaded, markers, userLocation]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={0}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={options}
    >
      {markers?.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
      {selectedContent && (
        <MapSheet
          isOpen={isSheetOpen}
          onClose={handleClose}
          content={selectedContent}
        />
      )}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default React.memo(Map);
