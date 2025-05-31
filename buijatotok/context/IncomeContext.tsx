import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Define income data structure
export interface IncomeData {
  month: string;
  income: number;
  clients: number;
}

// Define context structure
interface IncomeContextType {
  incomeData: IncomeData[];
  addIncome: (month: string, amount: number) => void;
  resetIncomeData: () => void;
  refreshIncomeData: () => Promise<boolean>;
  isLoading: boolean;
}

// Create context
const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

// Initial empty data for all months
const createInitialIncomeData = (): IncomeData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    income: 0,
    clients: 0
  }));
};

// Provider component
export const IncomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomeData, setIncomeData] = useState<IncomeData[]>(createInitialIncomeData());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load initial data from localStorage before API fetch completes
  useEffect(() => {
    const savedData = localStorage.getItem('incomeData');
    if (savedData) {
      setIncomeData(JSON.parse(savedData));
    }
    
    // Fetch fresh data from API
    refreshIncomeData();
  }, []);

  // Fungsi untuk mengambil data dari API
  const fetchIncomeDataFromAPI = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Dapatkan semua klien yang telah selesai
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`);
      
      if (response.data) {
        // Reset data
        const monthlyData = createInitialIncomeData();
        
        // Proses data klien
        response.data.forEach((client: any) => {
          if (client.status === 'selesai' && client.completedDate && client.payment) {
            const date = new Date(client.completedDate);
            const monthIndex = date.getMonth();
            
            // Update income dan jumlah klien
            monthlyData[monthIndex].income += Number(client.payment);
            monthlyData[monthIndex].clients += 1;
          }
        });
        
        // Perbarui state dan localStorage
        setIncomeData(monthlyData);
        localStorage.setItem('incomeData', JSON.stringify(monthlyData));
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Error fetching income data from API:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Function to add income for a specific month
  const addIncome = (month: string, amount: number) => {
    setIncomeData(prevData => {
      const updatedData = prevData.map(item => {
        if (item.month === month) {
          return {
            ...item,
            income: item.income + amount,
            clients: item.clients + 1
          };
        }
        return item;
      });
      
      // Simpan ke localStorage
      localStorage.setItem('incomeData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  // Reset function
  const resetIncomeData = () => {
    const initialData = createInitialIncomeData();
    setIncomeData(initialData);
    localStorage.setItem('incomeData', JSON.stringify(initialData));
  };

  // Refresh income data from API
  const refreshIncomeData = async (): Promise<boolean> => {
    return await fetchIncomeDataFromAPI();
  };

  return (
    <IncomeContext.Provider value={{ 
      incomeData, 
      addIncome, 
      resetIncomeData, 
      refreshIncomeData,
      isLoading 
    }}>
      {children}
    </IncomeContext.Provider>
  );
};

// Custom hook for using the context
export const useIncome = (): IncomeContextType => {
  const context = useContext(IncomeContext);
  if (context === undefined) {
    throw new Error('useIncome must be used within an IncomeProvider');
  }
  return context;
};