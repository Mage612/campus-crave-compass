import { X, Star, MapPin, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Restaurant } from "@/data/restaurants";

interface Props {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

const RestaurantDetail = ({ restaurant, isOpen, onClose }: Props) => {
  if (!restaurant) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* Detail Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-card shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative h-64">
              <img
                src={restaurant.img}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-card/80 backdrop-blur-sm rounded-full text-foreground hover:bg-card transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Name and Rating */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">{restaurant.name}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{restaurant.rate}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">|</span>
                  <span className="text-muted-foreground text-sm">
                    ￥{restaurant.price}/人
                  </span>
                </div>
              </div>

              {/* Category Tag */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full">
                  {restaurant.cat}
                </span>
              </div>

              {/* Recommendation */}
              <div className="mb-6">
                <p className="text-foreground">{restaurant.recommendation}</p>
              </div>

              {/* Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{restaurant.dist}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{restaurant.hours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className={`text-foreground font-medium ${
                    restaurant.open ? "text-green-500" : "text-red-500"
                  }`}>
                    {restaurant.open ? "营业中" : "休息中"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 transition-all shadow-md shadow-primary/20">
                  查看详情
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RestaurantDetail;