import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import { useIncome } from '../../../context/IncomeContext';
import Navbar from './Navbar';

interface IncomeData {
  month: string;
  income: number;
  clients: number;
}

const Progress: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
  const [currentMonthClients, setCurrentMonthClients] = useState(0);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  
  // Menggunakan Income Context untuk data yang sebenarnya
  const { incomeData, isLoading } = useIncome();
  
  // Check if user is authenticated using auth context
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push('/x7k9m2/Login');
    }
  }, [isAuthenticated, loading, router]);
  
  // Find max income for chart scaling and create better scale
  const maxIncome = Math.max(...incomeData.map(d => d.income));
  
  // Create a much better scale for Y-axis that handles any value
  const createYAxisScale = (maxValue: number) => {
    if (maxValue === 0) return [0, 1000000, 2000000, 3000000, 4000000, 5000000];
    
    // Determine the order of magnitude
    const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    
    // Find a nice step size
    let stepSize;
    const normalizedMax = maxValue / orderOfMagnitude;
    
    if (normalizedMax <= 1) stepSize = orderOfMagnitude / 5;
    else if (normalizedMax <= 2) stepSize = orderOfMagnitude / 2;
    else if (normalizedMax <= 5) stepSize = orderOfMagnitude;
    else stepSize = orderOfMagnitude * 2;
    
    // Calculate the actual max for the chart (rounded up to next step)
    const chartMax = Math.ceil(maxValue / stepSize) * stepSize;
    
    // Create 6 points (0 to chartMax)
    const steps = 5;
    const actualStep = chartMax / steps;
    
    return Array.from({ length: steps + 1 }, (_, i) => i * actualStep);
  };
  
  const yAxisScale = createYAxisScale(maxIncome);
  const chartMaxValue = yAxisScale[yAxisScale.length - 1];
  
  // Set current month on load
  useEffect(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const monthIndex = now.getMonth();
    
    setCurrentMonth(monthNames[monthIndex]);
    
    const thisMonthData = incomeData.find(d => d.month === monthNames[monthIndex]);
    if (thisMonthData) {
      setCurrentMonthIncome(thisMonthData.income);
      setCurrentMonthClients(thisMonthData.clients);
    }
  }, [incomeData]);
  
  // Total income for the year
  const totalYearIncome = incomeData.reduce((sum, item) => sum + item.income, 0);
  
  // Total clients for the year
  const totalYearClients = incomeData.reduce((sum, item) => sum + item.clients, 0);
  
  // Handle bar click
  const handleBarClick = (index: number) => {
    setSelectedBarIndex(selectedBarIndex === index ? null : index);
  };
  
  // Function to format currency for Y-axis labels
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(value % 1000000000 === 0 ? 0 : 1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };
  
  // Function to determine tooltip position based on bar height and position
  const getTooltipPosition = (barHeight: number, barIndex: number) => {
    const isHighBar = barHeight > 75; // If bar is more than 75% of chart height
    const isRightSide = barIndex >= incomeData.length - 3; // Last 3 bars
    
    return {
      position: isHighBar ? 'bottom' : 'top',
      alignment: isRightSide ? 'right' : 'center'
    };
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[#3A5645]" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // Return null to prevent flash of content before redirect
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <Navbar 
      activeMenu="progress" 
      pageTitle="Progress Pemasukan"
    >
      <main className="p-4 md:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Current Month Card */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Pemasukan Bulan Ini ({currentMonth})</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">Rp {currentMonthIncome.toLocaleString('id-ID')}</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-2">Dari {currentMonthClients} klien</p>
              </div>
              <div className="bg-[#3A5645] bg-opacity-10 p-3 rounded-full">
                <span className="text-xl text-[#3A5645]">📅</span>
              </div>
            </div>
          </div>

          {/* Year Total Card */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Pemasukan {selectedYear}</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">Rp {totalYearIncome.toLocaleString('id-ID')}</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-2">Dari {totalYearClients} klien</p>
              </div>
              <div className="bg-[#3A5645] bg-opacity-10 p-3 rounded-full">
                <span className="text-xl text-[#3A5645]">💰</span>
              </div>
            </div>
          </div>

          {/* Average Card */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Rata-rata Per Bulan</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                  Rp {totalYearClients > 0 
                    ? Math.round(totalYearIncome / (incomeData.filter(d => d.clients > 0).length || 1)).toLocaleString('id-ID') 
                    : '0'}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-2">Bulan dengan pemasukan</p>
              </div>
              <div className="bg-[#3A5645] bg-opacity-10 p-3 rounded-full">
                <span className="text-xl text-[#3A5645]">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Year Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Tahun</h3>
            <div className="flex items-center">
              <button 
                onClick={() => setSelectedYear(prev => prev - 1)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                ◀
              </button>
              <span className="mx-2 font-medium">{selectedYear}</span>
              <button 
                onClick={() => setSelectedYear(prev => prev + 1)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section - IMPROVED WITH DYNAMIC SCALING & SMART TOOLTIPS */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Grafik Pemasukan Bulanan {selectedYear}</h3>
          <p className="text-sm text-gray-500 mb-4">Klik pada bar untuk melihat detail pemasukan</p>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full text-[#3A5645]" role="status"></div>
                <p className="mt-2 text-gray-500">Memuat data grafik...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex">
                {/* Y-axis labels with dynamic scaling */}
                <div className="w-24 flex flex-col justify-between h-80 text-right text-xs text-gray-500 pr-3">
                  {yAxisScale.slice().reverse().map((value, index) => (
                    <span key={index} className="leading-4">
                      {formatCurrency(value)}
                    </span>
                  ))}
                </div>
                
                {/* Chart area with increased height for tooltip space */}
                <div className="flex-1 relative min-w-[600px]">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {yAxisScale.map((_, i) => (
                      <div key={i} className="border-b border-gray-100"></div>
                    ))}
                  </div>
                  
                  {/* Extra space for tooltips */}
                  <div className="h-16"></div>
                  
                  {/* Bars */}
                  <div className="h-64 flex items-end justify-between relative z-10 gap-2">
                    {incomeData.map((item, index) => {
                      const barHeight = chartMaxValue > 0 ? (item.income / chartMaxValue) * 100 : 0;
                      const isCurrentMonth = item.month === currentMonth;
                      const isSelected = selectedBarIndex === index;
                      const tooltipPos = getTooltipPosition(barHeight, index);
                      
                      return (
                        <div key={index} className="flex flex-col items-center group flex-1 max-w-16 relative">
                          {/* Smart Tooltip - adaptive position */}
                          {isSelected && (
                            <div className={`absolute text-xs text-center whitespace-nowrap bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-30 transform ${
                              tooltipPos.position === 'top' 
                                ? 'bottom-full mb-2' 
                                : 'top-full mt-2'
                            } ${
                              tooltipPos.alignment === 'right' 
                                ? 'right-0' 
                                : tooltipPos.alignment === 'left'
                                  ? 'left-0'
                                  : '-translate-x-1/2 left-1/2'
                            }`}>
                              <div className="font-semibold">Rp {item.income.toLocaleString('id-ID')}</div>
                              <div className="text-gray-200">{item.clients} klien</div>
                              <div className="text-gray-300 text-xs">
                                {item.clients > 0 ? `Avg: Rp ${Math.round(item.income / item.clients).toLocaleString('id-ID')}` : 'Tidak ada pemasukan'}
                              </div>
                              {/* Arrow */}
                              <div className={`absolute ${
                                tooltipPos.position === 'top' 
                                  ? 'top-full' 
                                  : 'bottom-full'
                              } ${
                                tooltipPos.alignment === 'right' 
                                  ? 'right-3' 
                                  : tooltipPos.alignment === 'left'
                                    ? 'left-3'
                                    : 'left-1/2 transform -translate-x-1/2'
                              }`}>
                                <div className={`border-4 border-transparent ${
                                  tooltipPos.position === 'top' 
                                    ? 'border-t-gray-800' 
                                    : 'border-b-gray-800'
                                }`}></div>
                              </div>
                            </div>
                          )}
                          
                          {/* Bar */}
                          <div 
                            className={`w-full rounded-t-md transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                              isCurrentMonth 
                                ? 'bg-[#3A5645] shadow-md ring-2 ring-[#3A5645] ring-opacity-50' 
                                : item.income > 0 
                                  ? 'bg-[#3A5645] bg-opacity-80 hover:bg-opacity-100 hover:shadow-lg' 
                                  : 'bg-gray-200 hover:bg-gray-300'
                            } ${
                              isSelected ? 'ring-4 ring-blue-300 ring-opacity-50 shadow-xl' : ''
                            }`}
                            style={{ 
                              height: item.income > 0 
                                ? `${Math.max((item.income / chartMaxValue) * 240, 8)}px`
                                : '8px'
                            }}
                            onClick={() => handleBarClick(index)}
                            title={`Klik untuk detail ${item.month}`}
                          ></div>
                          
                          {/* Month label */}
                          <div className={`text-sm font-medium mt-3 ${
                            isCurrentMonth ? 'text-[#3A5645] font-bold' : 'text-gray-600'
                          } ${isSelected ? 'text-blue-600 font-bold' : ''}`}>
                            {item.month}
                            {isCurrentMonth && (
                              <div className="w-2 h-2 bg-[#3A5645] rounded-full mx-auto mt-1"></div>
                            )}
                            {isSelected && !isCurrentMonth && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500 bg-gray-50 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#3A5645] rounded shadow-sm"></div>
                  <span>Bulan ini ({currentMonth})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#3A5645] bg-opacity-80 rounded"></div>
                  <span>Bulan lain</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Tidak ada pemasukan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 bg-opacity-20 border-2 border-blue-300 rounded"></div>
                  <span>Dipilih</span>
                </div>
              </div>
              
        
              
              {/* Dynamic scale info */}
              {maxIncome > 0 && (
                <div className="text-center mt-2 text-xs text-gray-400">
                  📊 Skala maksimum: Rp {formatCurrency(chartMaxValue)} | Pemasukan tertinggi: Rp {maxIncome.toLocaleString('id-ID')}
                </div>
              )}
              
              {/* Summary info */}
              {chartMaxValue === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">📊 Belum ada data pemasukan</p>
                  <p className="text-sm mt-1">Data akan muncul setelah ada klien dengan status 'selesai'</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Monthly Breakdown Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Detail Pemasukan Bulanan {selectedYear}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bulan
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Klien
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Pemasukan
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rata-rata per Klien
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomeData.map((item, index) => (
                  <tr key={index} className={`hover:bg-gray-50 transition-colors ${
                    item.month === currentMonth ? 'bg-green-50 border-l-4 border-[#3A5645]' : ''
                  } ${
                    selectedBarIndex === index ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                  }`}>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        item.month === currentMonth ? 'text-[#3A5645] font-bold' : 
                        selectedBarIndex === index ? 'text-blue-600 font-bold' : 'text-gray-900'
                      }`}>
                        {item.month}
                        {item.month === currentMonth && <span className="ml-2 text-xs bg-[#3A5645] text-white px-2 py-1 rounded">Bulan ini</span>}
                        {selectedBarIndex === index && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">Dipilih</span>}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.clients}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">Rp {item.income.toLocaleString('id-ID')}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.clients > 0 
                          ? `Rp ${Math.round(item.income / item.clients).toLocaleString('id-ID')}` 
                          : '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="font-semibold">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {totalYearClients}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    Rp {totalYearIncome.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {totalYearClients > 0 
                      ? `Rp ${Math.round(totalYearIncome / totalYearClients).toLocaleString('id-ID')}`
                      : '-'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
    </Navbar>
  );
};

export default Progress;