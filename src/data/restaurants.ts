export interface Restaurant {
  id: number;
  name: string;
  cat: string;
  price: number;
  rate: number;
  dist: string;
  pos: [number, number];
  open: boolean;
  hours: string;
  img: string;
  recommendation: string;
}

export const CATEGORIES = ["全部", "火锅", "炒菜", "烤肉", "西餐", "小吃", "奶茶", "夜宵"];

export const RESTAURANTS: Restaurant[] = [
  { id: 1, name: "蜀道山老火锅", cat: "火锅", price: 85, rate: 4.8, dist: "450m", pos: [31.285, 121.215], open: true, hours: "11:00-22:00", img: "https://images.unsplash.com/photo-1554672408-730436b60dde?w=400&q=80", recommendation: "正宗四川火锅，麻辣鲜香，冬天必备" },
  { id: 2, name: "学霸快餐", cat: "小吃", price: 15, rate: 4.2, dist: "120m", pos: [31.282, 121.212], open: true, hours: "08:00-20:00", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", recommendation: "快捷实惠，适合赶时间的学生党" },
  { id: 3, name: "西门烤肉", cat: "烤肉", price: 65, rate: 4.6, dist: "800m", pos: [31.288, 121.218], open: false, hours: "17:00-02:00", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", recommendation: "深夜必备，烤肉香飘整条街" },
  { id: 4, name: "不挂科奶茶", cat: "奶茶", price: 18, rate: 4.9, dist: "300m", pos: [31.284, 121.210], open: true, hours: "10:00-22:00", img: "https://images.unsplash.com/photo-1544787210-2827448b303c?w=400&q=80", recommendation: "喝了这杯奶茶，考试必过！" },
  { id: 5, name: "深夜食堂", cat: "夜宵", price: 40, rate: 4.5, dist: "1.2km", pos: [31.290, 121.220], open: true, hours: "20:00-04:00", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80", recommendation: "深夜暖胃好去处，各种小吃应有尽有" },
  { id: 6, name: "图书馆西餐", cat: "西餐", price: 120, rate: 4.7, dist: "600m", pos: [31.286, 121.211], open: true, hours: "11:00-21:30", img: "https://images.unsplash.com/photo-1550966841-3ee5ad6070d8?w=400&q=80", recommendation: "环境优雅，适合学习讨论的西餐厅" },
  { id: 7, name: "川味小炒", cat: "炒菜", price: 35, rate: 4.3, dist: "200m", pos: [31.281, 121.214], open: true, hours: "10:30-21:00", img: "https://images.unsplash.com/photo-1512058560366-cd2427ff5a63?w=400&q=80", recommendation: "正宗川菜，口味地道，价格实惠" },
  { id: 8, name: "东北大饺子", cat: "小吃", price: 20, rate: 4.4, dist: "400m", pos: [31.283, 121.219], open: true, hours: "09:00-21:00", img: "https://images.unsplash.com/photo-1523905330026-b8bd1f5f320e?w=400&q=80", recommendation: "手工饺子，皮薄馅大，东北风味" },
  { id: 9, name: "韩式炸鸡", cat: "小吃", price: 45, rate: 4.6, dist: "950m", pos: [31.289, 121.213], open: true, hours: "11:00-23:00", img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80", recommendation: "外酥里嫩，酱料正宗，韩剧同款" },
  { id: 10, name: "南门麻辣烫", cat: "小吃", price: 25, rate: 4.1, dist: "150m", pos: [31.280, 121.216], open: true, hours: "10:00-22:00", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80", recommendation: "自选食材，麻辣鲜香，性价比高" },
  { id: 11, name: "意式披萨屋", cat: "西餐", price: 70, rate: 4.5, dist: "1.5km", pos: [31.292, 121.225], open: true, hours: "10:00-22:00", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80", recommendation: "手工披萨，芝士浓郁，意式风情" },
  { id: 12, name: "校友咖啡", cat: "奶茶", price: 28, rate: 4.8, dist: "50m", pos: [31.282, 121.213], open: true, hours: "08:00-22:00", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80", recommendation: "环境安静，咖啡香浓，适合学习" },
  { id: 13, name: "潮汕牛肉火锅", cat: "火锅", price: 90, rate: 4.7, dist: "1.8km", pos: [31.295, 121.205], open: true, hours: "11:00-22:00", img: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&q=80", recommendation: "新鲜牛肉，汤底鲜美，潮汕特色" },
  { id: 14, name: "广式点心", cat: "小吃", price: 55, rate: 4.6, dist: "700m", pos: [31.287, 121.208], open: true, hours: "07:30-14:00", img: "https://images.unsplash.com/photo-1563245339-6b2e5a075077?w=400&q=80", recommendation: "精致点心，早茶首选，粤式风味" },
  { id: 15, name: "日式拉面", cat: "小吃", price: 38, rate: 4.4, dist: "550m", pos: [31.285, 121.222], open: true, hours: "11:00-21:00", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80", recommendation: "汤底浓郁，面条劲道，日式风味" },
  { id: 16, name: "新疆大串", cat: "烤肉", price: 50, rate: 4.9, dist: "2.1km", pos: [31.298, 121.215], open: true, hours: "17:00-01:00", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80", recommendation: "大块肉串，孜然飘香，新疆风味" },
  { id: 17, name: "泰式料理", cat: "西餐", price: 88, rate: 4.5, dist: "1.3km", pos: [31.291, 121.200], open: true, hours: "11:00-21:30", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80", recommendation: "酸辣可口，冬阴功汤正宗，泰式风情" },
  { id: 18, name: "老北京炸酱面", cat: "炒菜", price: 22, rate: 4.2, dist: "350m", pos: [31.283, 121.205], open: true, hours: "10:00-21:00", img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80", recommendation: "炸酱香浓，面条劲道，老北京风味" },
];
