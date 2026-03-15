import { Star, MapPin, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Restaurant } from "@/data/restaurants";

interface Props {
  data: Restaurant;
  active: boolean;
  onClick: () => void;
}

const RestaurantCard = ({ data, active, onClick }: Props) => (
  <motion.div
    layout
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`group relative flex gap-4 p-4 mb-3 cursor-pointer rounded-2xl transition-all duration-200 ${
      active
        ? "bg-card shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.25)] ring-2 ring-primary"
        : "bg-card/60 hover:bg-card shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
    }`}
  >
    {/* Thumbnail */}
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
      <img
        src={data.img}
        alt={data.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      {!data.open && (
        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold px-2 py-1 border border-primary-foreground/30 rounded-full backdrop-blur-sm">
            休息中
          </span>
        </div>
      )}
    </div>

    {/* Info */}
    <div className="flex flex-col justify-between flex-1 min-w-0">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-foreground truncate text-lg leading-tight">
            {data.name}
          </h3>
          <span className="flex items-center text-accent text-sm font-bold shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
            {data.rate}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-md">
            {data.cat}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 bg-muted rounded-md">
            ￥{data.price}/人
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground font-medium">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {data.dist}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {data.hours}
          </span>
        </div>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${
            active ? "translate-x-1 text-primary" : "text-muted-foreground/40"
          }`}
        />
      </div>
    </div>
  </motion.div>
);

export default RestaurantCard;
