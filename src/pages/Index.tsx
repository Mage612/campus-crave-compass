import { useState, useMemo, useRef } from "react";
import { Search, Sparkles, Flame, Navigation, MessageSquare, Mic, Send } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import RestaurantCard from "@/components/RestaurantCard";
import FoodMap from "@/components/FoodMap";
import RestaurantDetail from "@/components/RestaurantDetail";
import { CATEGORIES, RESTAURANTS } from "@/data/restaurants";
import { motion } from "framer-motion";
// import { motion, AnimatePresence } from "framer-motion";
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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof RESTAURANTS[0] | null>(null);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<typeof RESTAURANTS>([]);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiRecommendations, setAiRecommendations] = useState<typeof RESTAURANTS>([]);
  const [isListening, setIsListening] = useState(false);
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

  const handleRestaurantClick = (restaurant: typeof RESTAURANTS[0]) => {
    setActiveId(restaurant.id);
    setSelectedRestaurant(restaurant);
    setIsDetailOpen(true);
  };

  const handleAiQuery = (query: string) => {
    setAiQuery(query);
    
    // 解析查询
    let maxPrice = 1000;
    let isQuick = false;
    let isOpenNow = false;
    
    if (query.includes("20元")) maxPrice = 20;
    else if (query.includes("30元")) maxPrice = 30;
    else if (query.includes("50元")) maxPrice = 50;
    
    if (query.includes("快吃") || query.includes("一个人")) isQuick = true;
    if (query.includes("营业")) isOpenNow = true;
    
    // 筛选餐厅
    let filtered = RESTAURANTS;
    if (isOpenNow) filtered = filtered.filter(item => item.open);
    filtered = filtered.filter(item => item.price <= maxPrice);
    
    // 排序
    if (isQuick) {
      // 快吃优先考虑距离
      filtered.sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));
    } else {
      // 否则综合考虑评分和距离
      filtered.sort((a, b) => {
        const scoreA = a.rate * 0.6 + (500 / parseFloat(a.dist)) * 0.4;
        const scoreB = b.rate * 0.6 + (500 / parseFloat(b.dist)) * 0.4;
        return scoreB - scoreA;
      });
    }
    
    // 取前3家
    const topRestaurants = filtered.slice(0, 3).map(item => {
      // 生成推荐理由
      let reason = "";
      if (item.open) reason += "当前营业中";
      if (parseFloat(item.dist) < 500) reason += reason ? "，" : "" + "距离较近";
      if (item.price < 30) reason += reason ? "，" : "" + "价格实惠";
      if (item.rate > 4.5) reason += reason ? "，" : "" + "评分较高";
      if (!reason) reason = "综合推荐";
      return { ...item, reason };
    });
    
    setAiRecommendations(topRestaurants);
  };

  const handleMicClick = () => {
    setIsListening(true);
    
    // 模拟语音识别过程
    setTimeout(() => {
      const exampleQuery = "帮我找一家20元以内的单人餐";
      setAiQuery(exampleQuery);
      setIsListening(false);
      handleAiQuery(exampleQuery);
    }, 1500);
  };

  const handleQuickFilter = (type: "variety" | "now") => {
    if (type === "variety") {
      // 排除小吃类，推荐特色餐厅
      setFilter("全部");
      setSortType("rate");
      setOpenOnly(true);
      setRecommendedRestaurants([]);
    } else {
      // 现在能吃的、近的
      setFilter("全部");
      setSortType("dist");
      setOpenOnly(true);
      setPriceRange("全部价位");
      
      // 推荐逻辑
      const openRestaurants = RESTAURANTS.filter(item => item.open);
      
      // 计算推荐分数（距离越近、评分越高、价格越合理得分越高）
      const scoredRestaurants = openRestaurants.map(restaurant => {
        const distance = parseFloat(restaurant.dist);
        const score = (5 - distance / 500) * 0.4 + restaurant.rate * 0.4 + (100 - restaurant.price) / 100 * 0.2;
        return { ...restaurant, score };
      });
      
      // 按分数排序，取前3家
      const topRestaurants = scoredRestaurants
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => {
          // 生成推荐理由
          let reason = "";
          if (item.open) reason += "当前营业中";
          if (parseFloat(item.dist) < 500) reason += reason ? "，" : "" + "距离较近";
          if (item.price < 50) reason += reason ? "，" : "" + "性价比较高";
          if (!reason) reason = "综合推荐";
          return { ...item, reason };
        });
      
      setRecommendedRestaurants(topRestaurants);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen w-full bg-background overflow-hidden">
        {/* ===== Sidebar ===== */}
        <aside className="w-full md:w-[420px] h-[50vh] md:h-full flex flex-col z-20 bg-card/90 backdrop-blur-xl border-r border-border/30 shadow-lg shadow-primary/10">
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
              className="p-3 bg-primary text-primary-foreground rounded-2xl hover:brightness-110 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 group"
              title="随机推荐"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
            </button>
          </header>

          {/* Quick action buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleQuickFilter("variety")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/20"
            >
              <Flame className="w-3.5 h-3.5" />
              吃腻食堂了？
            </button>
            <button
              onClick={() => handleQuickFilter("now")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/20"
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
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  filter === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card/80 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/30"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  priceRange === pr
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-card/60 text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {pr}
              </button>
            ))}
            <button
              onClick={() => setOpenOnly(!openOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                openOnly
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-card/60 text-muted-foreground hover:bg-primary/10"
              }`}
            >
              营业中
            </button>
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between py-2 border-b border-border/30 mb-4">
            <div className="flex gap-4">
              {(["dist", "rate", "price"] as SortType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setSortType(t)}
                  className={`text-xs font-bold transition-colors duration-300 ${
                    sortType === t ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {SORT_LABELS[t]}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
              {filteredData.length} 结果
            </span>
          </div>
        </div>

        {/* Restaurant list */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-5 pb-6 no-scrollbar">
          <AnimatePresence mode="popLayout">
            {/* Recommended restaurants */}
            {recommendedRestaurants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  为你推荐
                </h3>
                {recommendedRestaurants.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group relative flex gap-4 p-4 mb-3 cursor-pointer rounded-2xl transition-all duration-300 bg-primary/5 border border-primary/20 shadow-md shadow-primary/10"
                    onClick={() => handleRestaurantClick(item)}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-foreground truncate text-lg leading-tight">
                            {item.name}
                          </h3>
                          <span className="flex items-center text-accent text-sm font-bold shrink-0 ml-2">
                            <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                            {item.rate}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                            {item.cat}
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 bg-muted rounded-md">
                            ￥{item.price}/人
                          </span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-xs text-primary font-medium">
                          {item.reason}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Regular restaurant list */}
            {filteredData.map((item) => (
              <RestaurantCard
                key={item.id}
                data={item}
                active={activeId === item.id}
                onClick={() => handleRestaurantClick(item)}
              />
            ))}
            {filteredData.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                没有找到符合条件的餐厅 🍜
              </div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* ===== Map ===== */}
      <main className="flex-1 relative h-[50vh] md:h-full">
        <FoodMap
          restaurants={filteredData}
          activeId={activeId}
          onSelect={setActiveId}
          onMarkerClick={handleRestaurantClick}
        />

        {/* Floating search */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-focus-within:bg-primary/30 transition-all duration-300" />
            <div className="relative flex items-center bg-card/95 backdrop-blur-md rounded-2xl p-2 shadow-xl shadow-primary/15 border border-border/30 transition-all duration-300 group-focus-within:shadow-2xl group-focus-within:shadow-primary/20">
              <div className="p-3 text-primary transition-colors duration-300">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="搜索店名、分类或想吃的..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-foreground placeholder:text-muted-foreground/70 transition-colors duration-300"
              />
              <button
                onClick={() => {
                  setFilter("全部");
                  setSearch("");
                  setPriceRange("全部价位");
                  setOpenOnly(false);
                  setRecommendedRestaurants([]);
                }}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black transition-all duration-300"
              >
                重置
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    {/* AI Assistant */}
    <div className="z-[1001]">
      {/* AI Assistant Button */}
      <button
        onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
        className="fixed bottom-8 right-8 p-4 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/20 hover:brightness-110 transition-all duration-300 z-[1002]"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
      
      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isAiAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-8 w-80 bg-card rounded-2xl shadow-2xl border border-border/30 p-4 z-[1001]"
          >
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI 决策助手
            </h3>
            
            {/* Quick Questions */}
            <div className="grid grid-cols-1 gap-2 mb-4">
              <button
                onClick={() => handleAiQuery("20元内吃什么")}
                className="px-3 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors duration-300"
              >
                20元内吃什么
              </button>
              <button
                onClick={() => handleAiQuery("适合一个人快吃")}
                className="px-3 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors duration-300"
              >
                适合一个人快吃
              </button>
              <button
                onClick={() => handleAiQuery("现在还有什么营业")}
                className="px-3 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors duration-300"
              >
                现在还有什么营业
              </button>
            </div>
            
            {/* Input Area */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder={isListening ? "正在聆听..." : "比如：30元内、两个人、想吃辣"}
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiQuery(aiQuery)}
                disabled={isListening}
                className="flex-1 bg-background border border-border/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={() => handleAiQuery(aiQuery)}
                disabled={isListening}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-colors duration-300 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
              <button 
                onClick={handleMicClick}
                disabled={isListening}
                className="p-2 bg-background border border-border/30 rounded-lg hover:bg-muted transition-colors duration-300 relative"
              >
                <Mic className={`w-4 h-4 ${isListening ? 'text-primary' : 'text-muted-foreground'}`} />
                {isListening && (
                  <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  </div>
                )}
              </button>
            </div>
            
            {/* Recommendations */}
            {aiRecommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">推荐餐厅</h4>
                {aiRecommendations.map((item) => (
                  <div key={item.id} className="p-3 bg-background rounded-lg border border-border/30">
                    <h5 className="font-medium text-foreground mb-1">{item.name}</h5>
                    <p className="text-xs text-muted-foreground mb-2">{item.reason}</p>
                    <button
                      onClick={() => {
                        setActiveId(item.id);
                        setSelectedRestaurant(item);
                        setIsDetailOpen(true);
                        setIsAiAssistantOpen(false);
                      }}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      查看
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    
    <RestaurantDetail
      restaurant={selectedRestaurant}
      isOpen={isDetailOpen}
      onClose={() => setIsDetailOpen(false)}
    />
  </>
);
};

export default Index;
