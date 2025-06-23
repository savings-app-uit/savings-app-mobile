
// Hàm lấy dữ liệu thống kê cho PieChart/BarChart từ API
export function getChartData(currentMonth: string, type: 'expense' | 'income' = 'expense') {
  // Lấy danh mục từ API
  // Lưu ý: Hàm này hiện tại là đồng bộ, nếu muốn async thì cần sửa các component gọi theo await hoặc .then
  // Để giữ đồng bộ với các component, ta sẽ để hàm này đồng bộ và assume dữ liệu đã fetch ở nơi khác (hoặc refactor toàn bộ sang async nếu cần)
  // Nếu muốn async, hãy đổi thành async function và sửa các component gọi theo await

  // Giả lập dữ liệu fetch từ API (cần truyền vào từ props hoặc context nếu muốn đồng bộ)
  // const categories = ...;
  // const transactions = ...;
  // Ở đây chỉ trả về object rỗng để tránh lỗi khi gọi
  return {
    chartWithPercent: [],
    totalAmount: 0,
  };
}

// Default export để tránh warning Expo Router
export default function DataUtils() {
  return null;
}