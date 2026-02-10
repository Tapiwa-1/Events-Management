export function getFinancialData(events, transactions, loans, repayments, maintenanceLogs, startDate, endDate) {
  const dates = [];
  const incomeData = {};
  const expenseData = {};
  const salesData = {};
  const bookingsData = {};
  const statusCounts = {};

  // Ensure dates are valid
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("Invalid start or end date provided to getFinancialData");
      return { labels: [], income: [], expense: [], sales: [], bookings: [], statusCounts: {} };
  }

  // Create an array of dates within the range
  // Clone start to avoid mutation issues if reused, though not reused here.
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    try {
        const dateStr = d.toISOString().split('T')[0];
        dates.push(dateStr);
        incomeData[dateStr] = 0;
        expenseData[dateStr] = 0;
        salesData[dateStr] = 0;
        bookingsData[dateStr] = 0;
    } catch (e) {
        console.error("Error generating date in loop", e);
    }
  }

  // Helper to check if date is in range
  const isDateInRange = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    try {
        const isoDate = d.toISOString().split('T')[0];
        // Use lexical comparison for YYYY-MM-DD
        return isoDate >= startDate && isoDate <= endDate;
    } catch (e) {
        return false;
    }
  };

  // 1. Process Events
  events.forEach(event => {
    if (isDateInRange(event.date)) {
      const dateStr = new Date(event.date).toISOString().split('T')[0];

      // Income: Amount Paid
      if (event.amount_paid > 0) {
        incomeData[dateStr] = (incomeData[dateStr] || 0) + event.amount_paid;
      }

      // Expense: Transport Cost
      if (event.transport_cost > 0) {
        expenseData[dateStr] = (expenseData[dateStr] || 0) + event.transport_cost;
      }

      // Sales: Total Cost
      if (event.total_cost > 0) {
        salesData[dateStr] = (salesData[dateStr] || 0) + event.total_cost;
      }

      // Bookings: Count
      bookingsData[dateStr] = (bookingsData[dateStr] || 0) + 1;

      // Status Breakdown
      const status = event.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }
  });

  // 2. Process Transactions
  transactions.forEach(tx => {
    if (isDateInRange(tx.date)) {
      const dateStr = new Date(tx.date).toISOString().split('T')[0];
      if (tx.type === 'in') {
        incomeData[dateStr] = (incomeData[dateStr] || 0) + tx.amount;
      } else if (tx.type === 'out' && tx.category !== 'drawing') {
        expenseData[dateStr] = (expenseData[dateStr] || 0) + tx.amount;
      }
    }
  });

  // 3. Process Loans (Money Out)
  loans.forEach(loan => {
    if (isDateInRange(loan.date_given)) {
      const dateStr = new Date(loan.date_given).toISOString().split('T')[0];
      expenseData[dateStr] = (expenseData[dateStr] || 0) + loan.amount;
    }
  });

  // 4. Process Loan Repayments (Money In)
  repayments.forEach(rep => {
    if (isDateInRange(rep.date)) {
      const dateStr = new Date(rep.date).toISOString().split('T')[0];
      incomeData[dateStr] = (incomeData[dateStr] || 0) + rep.amount;
    }
  });

  // 5. Process Maintenance Logs (Money Out)
  maintenanceLogs.forEach(log => {
    if (isDateInRange(log.date) && log.cost > 0 && log.status === 'Fixed') {
      const dateStr = new Date(log.date).toISOString().split('T')[0];
      expenseData[dateStr] = (expenseData[dateStr] || 0) + log.cost;
    }
  });

  // Convert objects to arrays aligned with 'dates'
  const incomeArray = dates.map(d => incomeData[d] || 0);
  const expenseArray = dates.map(d => expenseData[d] || 0);
  const salesArray = dates.map(d => salesData[d] || 0);
  const bookingsArray = dates.map(d => bookingsData[d] || 0);

  return {
    labels: dates,
    income: incomeArray,
    expense: expenseArray,
    sales: salesArray,
    bookings: bookingsArray,
    statusCounts
  };
}
