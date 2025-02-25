import { useState, useEffect, useCallback } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MapComponent = withScriptjs(
	withGoogleMap(({ isMarkerShown, onMarkerClick }) => (
		<GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
			{isMarkerShown && (
				<Marker position={{ lat: -34.397, lng: 150.644 }} onClick={onMarkerClick} />
			)}
		</GoogleMap>
	))
);

export const MyFancyComponent = () => {
	const [isMarkerShown, setIsMarkerShown] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsMarkerShown(true);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

	const handleMarkerClick = useCallback(() => {
		setIsMarkerShown(false);
		setTimeout(() => setIsMarkerShown(true), 3000);
	}, []);

	return (
		<MapComponent
			isMarkerShown={isMarkerShown}
			onMarkerClick={handleMarkerClick}
			googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
			loadingElement={<div style={{ height: "100%" }} />}
			containerElement={<div style={{ height: "400px" }} />}
			mapElement={<div style={{ height: "100%" }} />}
		/>
	);
};

export default MyFancyComponent;
