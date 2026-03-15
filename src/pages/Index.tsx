import { useState, useMemo, useRef } from "react";
import { Search, Sparkles, Flame, Navigation } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import RestaurantCard from "@/components/RestaurantCard";
import FoodMap from "@/components/FoodMap";
import { CATEGORIES, RESTAURANTS } from "@/data/restaurants";

type SortType = "dist" | "rate" | "price";

const SORT_LABELS: Record<SortType, string> = {
  dist: "距离优先",
  rate: "高分优先",
  price: "性价比",
};

const PRICE_RANGES = ["全部价位", "≤20", "20-50", "50-100", "100+"];

const Index = () => {
  const [filter, setFilter] = useState("全部");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>("dist");
  const [priceRange, setPriceRange] = useState("全部价位");
  const [openOnly, setOpenOnly] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    return RESTAURANTS.filter((item) => {
      if (filter !== "全部" && item.cat !== filter) return false;
      if (search && !item.name.includes(search) && !item.cat.includes(search)) return false;
      if (openOnly && !item.open) return false;
      if (priceRange === "≤20" && item.price > 20) return false;
      if (priceRange === "20-50" && (item.price < 20 || item.price > 50)) return false;
      if (priceRange === "50-100" && (item.price < 50 || item.price > 100)) return false;
      if (priceRange === "100+" && item.price < 100) return false;
      return true;
    }).sort((a, b) => {
      if (sortType === "rate") return b.rate - a.rate;
      if (sortType === "price") return a.price - b.price;
      return parseFloat(a.dist) - parseFloat(b.dist);
    });
  }, [filter, search, sortType, priceRange, openOnly]);

  const handleRandom = () => {
    const r = filteredData[Math.floor(Math.random() * filteredData.length)];
    if (r) setActiveId(r.id);
  };

  const handleQuickFilter = (type: "variety" | "now") => {
    if (type === "variety") {
      // 排除小吃类，推荐特色餐厅
      setFilter("全部");
      setSortType("rate");
      setOpenOnly(true);
    } else {
      // 现在能吃的、近的
      setFilter("全部");
      setSortType("dist");
      setOpenOnly(true);
      setPriceRange("全部价位");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-background overflow-hidden">
      {/* ===== Sidebar ===== */}
      <aside className="w-full md:w-[420px] h-[50vh] md:h-full flex flex-col z-20 bg-card/80 backdrop-blur-xl border-r border-border shadow-2xl">
        <div className="p-5 pb-2">
          {/* Header */}
          <header className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                大学城美食
                <span className="text-primary">MAP</span>
              </h1>
              <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-widest">
                Campus Food Discovery
              </p>
            </div>
            <button
              onClick={handleRandom}
              className="p-3 bg-primary text-primary-foreground rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 group"
              title="随机推荐"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </header>

          {/* Quick action buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleQuickFilter("variety")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <Flame className="w-3.5 h-3.5" />
              吃腻食堂了？
            </button>
            <button
              onClick={() => handleQuickFilter("now")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              现在吃什么
            </button>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  filter === cat
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price filter + Open only */}
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
            {PRICE_RANGES.map((pr) => (
              <button
                key={pr}
                onClick={() => setPriceRange(pr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  priceRange === pr
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {pr}
              </button>
            ))}
            <button
              onClick={() => setOpenOnly(!openOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                openOnly
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10"
              }`}
            >
              营业中
            </button>
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between py-2 border-b border-border mb-3">
            <div className="flex gap-4">
              {(["dist", "rate", "price"] as SortType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setSortType(t)}
                  className={`text-xs font-bold ${
                    sortType === t ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {SORT_LABELS[t]}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase">
              {filteredData.length} 结果
            </span>
          </div>
        </div>

        {/* Restaurant list */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-5 pb-6 no-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredData.map((item) => (
              <RestaurantCard
                key={item.id}
                data={item}
                active={activeId === item.id}
                onClick={() => setActiveId(item.id)}
              />
            ))}
          </AnimatePresence>
          {filteredData.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              没有找到符合条件的餐厅 🍜
            </div>
          )}
        </div>
      </aside>

      {/* ===== Map ===== */}
      <main className="flex-1 relative h-[50vh] md:h-full">
        <FoodMap
          restaurants={filteredData}
          activeId={activeId}
          onSelect={setActiveId}
        />

        {/* Floating search */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-focus-within:bg-primary/40 transition-all" />
            <div className="relative flex items-center bg-card/90 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-border">
              <div className="p-3 text-primary">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="搜索店名、分类或想吃的..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={() => {
                  setFilter("全部");
                  setSearch("");
                  setPriceRange("全部价位");
                  setOpenOnly(false);
                }}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-xl text-xs font-black transition-colors"
              >
                重置
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
