
export const allCategories = [
  { name: "Chợ, siêu thị", icon: "basket", color: "#f46e45" },
  { name: "Ăn uống", icon: "fast-food", color: "#f46e45" },
  { name: "Di chuyển", icon: "car", color: "#62aef7" },
  { name: "Mua sắm", icon: "cart", color: "#f6b100" },
  { name: "Giải trí", icon: "play", color: "#f78c8c" },
  { name: "Làm đẹp", icon: "cut", color: "#ef60a3" },
  { name: "Sức khỏe", icon: "heart", color: "#f5536c" },
  { name: "Từ thiện", icon: "gift", color: "#f58cd2" },
  { name: "Hóa đơn", icon: "document-text", color: "#2ec3a2" },
  { name: "Nhà cửa", icon: "home", color: "#937be1" },
  { name: "Người thân", icon: "people", color: "#f57cac" },
  { name: "Đầu tư", icon: "trending-up", color: "#4caf50" },
  { name: "Tiết kiệm", icon: "wallet", color: "#4caf50" },
];

export const transactions = [
    { id: '1', date: '2025-06-19', title: 'Thanh toán RAU MÁ BK', category: 'Ăn uống', amount: 35000 },
    { id: '2', date: '2025-06-18', title: 'Mua nước', category: 'Ăn uống', amount: 15000 },
    { id: '3', date: '2025-06-19', title: 'Dukki', category: 'Ăn uống', amount: 500000 },
    { id: '4', date: '2025-06-17', title: 'Mua xăng', category: 'Di chuyển', amount: 80000 },
    { id: '5', date: '2025-06-16', title: 'Ăn trưa quán cơm', category: 'Ăn uống', amount: 40000 },
    { id: '7', date: '2025-06-15', title: 'Mua sách', category: 'Mua sắm', amount: 120000 },
    { id: '8', date: '2025-06-14', title: 'Mua áo thun', category: 'Mua sắm', amount: 150000 },
    { id: '10', date: '2025-06-13', title: 'Cà phê với bạn', category: 'Giải trí', amount: 60000 },
    { id: '11', date: '2025-06-12', title: 'Gửi xe tháng', category: 'Hóa đơn', amount: 100000 },
    { id: '12', date: '2025-06-11', title: 'Thanh toán Internet', category: 'Hóa đơn', amount: 200000 },
    { id: '13', date: '2025-06-11', title: 'Giveaway', category: 'Từ thiện', amount: 10000 },
  ];


  export function getChartData(currentMonth: string) {
  const filteredTransactions = transactions.filter((tx) =>
    tx.date.startsWith(currentMonth)
  );

  const totalExpense = filteredTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  const pieDataRaw = filteredTransactions.reduce((acc, tx) => {
    const existing = acc.find((item) => item.name === tx.category);
    if (existing) {
      existing.amount += tx.amount;
    } else {
      acc.push({ name: tx.category, amount: tx.amount });
    }
    return acc;
  }, [] as { name: string; amount: number }[]);

  pieDataRaw.sort((a, b) => b.amount - a.amount);

  const topItems = pieDataRaw.slice(0, 4);
  const otherItems = pieDataRaw.slice(4);

  const chartWithPercent = topItems.map((item) => {
    const cat = allCategories.find((c) => c.name === item.name);
    const percent = ((item.amount / totalExpense) * 100).toFixed(0);
    return {
      name: item.name,
      amount: item.amount,
      percent,
      icon: cat?.icon,
      color: cat?.color ?? "#ccc",
    };
  });

  if (otherItems.length > 0) {
    const otherAmount = otherItems.reduce((sum, item) => sum + item.amount, 0);
    const otherPercent = ((otherAmount / totalExpense) * 100).toFixed(0);
    chartWithPercent.push({
      name: "Còn lại",
      amount: otherAmount,
      percent: otherPercent,
      icon: "grid",
      color: "#ccc",
    });
  }

  return { chartWithPercent, totalExpense };
}