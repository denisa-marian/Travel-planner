import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { europeanCities, City } from "../data/europeanCities";
import "leaflet/dist/leaflet.css";

const cityIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
  iconSize: [32, 32],
});

export default function MapView({
  onCitySelect,
}: {
  onCitySelect: (city: string, coords: [number, number]) => void;
}) {
  return (
    <MapContainer
      center={[54, 15] as LatLngExpression}
      zoom={4}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png" />

      {europeanCities.map((city: City, index: number) => (
        <Marker
          key={index}
          position={city.coords as LatLngExpression}
          icon={cityIcon}
          eventHandlers={{
            click: () => onCitySelect(city.name, city.coords),
          }}
        >
          <Popup>
            <strong>{city.name}</strong>
            <br />
            Selectează pentru excursii.
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
