'use client';

import { useEffect, useState } from 'react';
import { fetchLatestRates, fetchHistoricalData } from '../services/currencyService';
import CurrencyChart from './CurrencyChart';

const TARGET_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'NZD'];

export default function CurrencyConverter() {
    const [amountAUD, setAmountAUD] = useState(1);
    const [rates, setRates] = useState({});
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        const getRates = async () => {
            setIsLoading(true);
            try {
                const data = await fetchLatestRates();
                if (data) {
                    setRates(data);
                    setLastUpdated(new Date().toLocaleTimeString());
                } else {
                    setError('Failed to fetch exchange rates');
                }
            } catch (err) {
                setError('An error occurred while fetching exchange rates');
            } finally {
                setIsLoading(false);
            }
        };
        getRates();
    }, []);

    const handleCurrencyClick = async (currency) => {
        setSelectedCurrency(currency);
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await fetchHistoricalData(currency);
            if (data) {
                setHistoricalData(data);
            } else {
                setError('Failed to fetch historical data');
            }
        } catch (err) {
            setError('An error occurred while fetching historical data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Currency Converter</h1>
                    
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            <input
                                type="number"
                                value={amountAUD}
                                onChange={(e) => setAmountAUD(parseFloat(e.target.value) || 0)}
                                className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                            />
                            <span className="text-xl font-semibold text-gray-700">AUD</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Converted Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {TARGET_CURRENCIES.map(currency => (
                                    <tr 
                                        key={currency}
                                        onClick={() => handleCurrencyClick(currency)}
                                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                                            selectedCurrency === currency ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {currency}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {rates[currency] ? (amountAUD * rates[currency]).toFixed(2) : 'Loading...'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {lastUpdated && (
                        <div className="text-sm text-gray-500 text-center mt-4">
                            Last updated: {lastUpdated}
                        </div>
                    )}

                    {selectedCurrency && (
                        <div className="mt-8">
                            <CurrencyChart 
                                currency={selectedCurrency} 
                                historicalData={historicalData}
                                isLoading={isLoading}
                                error={error}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 