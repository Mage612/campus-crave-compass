import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Restaurant } from "@/data/restaurants";

/* Controller to fly to active restaurant */
const MapController = ({ center }: { center?: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 16, { duration: 1.5 });
  }, [center, map]);
  return null;
};

interface Props {
  restaurants: Restaurant[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onMarkerClick?: (restaurant: Restaurant) => void;
}

const FoodMap = ({ restaurants, activeId, onSelect, onMarkerClick }: Props) => {
  const active = restaurants.find((r) => r.id === activeId);

  return (
    <MapContainer
      center={[31.285, 121.215]}
      zoom={15}
      className="h-full w-full z-10"
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap"
      />
      <MapController center={active?.pos} />

      {restaurants.map((item) => (
        <Marker
          key={item.id}
          position={item.pos}
          icon={L.divIcon({
            className: "custom-div-icon",
            html: `<div style="
              background:${activeId === item.id ? "hsl(24,100%,50%)" : "white"};
              color:${activeId === item.id ? "white" : "hsl(24,100%,50%)"};
              width:40px;height:40px;display:flex;align-items:center;justify-content:center;
              border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);
              border:2px solid ${activeId === item.id ? "white" : "hsl(24,100%,50%)"};
              font-weight:800;font-size:12px;transition:all .3s;
            ">￥${item.price}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          })}
          eventHandlers={{ click: () => {
            onSelect(item.id);
            if (onMarkerClick) {
              onMarkerClick(item);
            }
          } }}
        >
          <Popup>
            <div className="p-1">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <h4 className="font-black text-sm">{item.name}</h4>
              <p className="text-[10px] text-muted-foreground font-bold mb-2">
                {item.cat} · {item.dist} · ￥{item.price}/人
              </p>
              <div className="flex items-center gap-1 text-accent text-xs font-bold mb-2">
                <span>★ {item.rate}</span>
              </div>
              <button className="w-full py-2 bg-secondary text-secondary-foreground text-[10px] font-black rounded-md uppercase tracking-widest">
                查看详情
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default FoodMap;
