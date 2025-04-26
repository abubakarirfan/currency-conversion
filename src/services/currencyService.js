import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENEXCHANGE_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchLatestRates() {
    try {
        const response = await axios.get(`${BASE_URL}/latest.json`, {
            params: { app_id: API_KEY }
        });
        
        // Get USD to AUD rate
        const usdToAud = response.data.rates.AUD;
        
        // Convert all rates to AUD base
        const rates = {};
        Object.entries(response.data.rates).forEach(([currency, rate]) => {
            rates[currency] = rate / usdToAud;
        });
        
        return rates;
    } catch (error) {
        console.error('Error fetching latest rates:', error);
        return null;
    }
}

export async function fetchHistoricalData(currency) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 13); // 14 days including today

        // Generate array of dates for the last 14 days
        const historicalDates = Array.from({ length: 14 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return date.toISOString().split('T')[0];
        });

        const historicalData = await Promise.all(
            historicalDates.map(async (date) => {
                try {
                    const response = await axios.get(`${BASE_URL}/historical/${date}.json`, {
                        params: { 
                            app_id: API_KEY,
                            symbols: `${currency},AUD`
                        }
                    });

                    const usdToAud = response.data.rates.AUD;
                    const currencyRate = response.data.rates[currency];
                    
                    return {
                        date,
                        rate: currencyRate / usdToAud
                    };
                } catch (error) {
                    console.error(`Error fetching data for ${date}:`, error);
                    return null;
                }
            })
        );

        // Filter out any failed requests and sort by date
        return historicalData
            .filter(data => data !== null)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return null;
    }
} 