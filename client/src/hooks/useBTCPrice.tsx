import { useState, useEffect } from 'react';
import axios from 'axios';

export const useBtcPrice = () => {
    const [btcPrice, setBtcPrice] = useState<number>(0);

    useEffect(() => {
        const fetchBtcPrice = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                    params: {
                        ids: 'bitcoin',
                        vs_currencies: 'usd',
                        x_cg_demo_api_key: "CG-Q3CkX2sTEpbc5y8o8piYEuXC"

                    }
                });
                setBtcPrice(response.data.bitcoin.usd);
                localStorage.setItem('btcPrice', response.data.bitcoin.usd.toString());
            } catch (error) {
                console.error('Error fetching BTC price:', error);
            }
        };

        const guessId = localStorage.getItem('guessId');
        if (!guessId) {
            fetchBtcPrice();
        }
    }, []);

    return [btcPrice, setBtcPrice] as const
};
