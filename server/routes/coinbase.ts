import { 
    BACKEND_URL, 
    CLIENT_URL, 
    COINBASE_CLIENT_ID, 
    COINBASE_CLIENT_SECRET 
} from "../constants";

import express from 'express';
const router = express.Router();
import axios from 'axios';
import logger from "../util/logger";

const OAUTH_TOKEN_URL = 'https://api.coinbase.com/oauth/token';  
const CLIENT_ID = COINBASE_CLIENT_ID;
const CLIENT_SECRET = COINBASE_CLIENT_SECRET;
const REDIRECT_URI = `${BACKEND_URL}/cb-callback`; 

router.get('/cb-callback', async (req, res) => {
    const CLIENT_CALLBACK_URL = `${CLIENT_URL}/cb-callback?state=${req.query.state}&close=true`

    try {
        const authorizationCode = req.query.code;

        if (!authorizationCode) {
            return res.status(400).send('No authorization code provided');
        }
    
        try {
            const response = await axios.post(OAUTH_TOKEN_URL, {
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            });
    
            const accessToken = response.data.access_token;
            
            // Set the access token as a cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: REDIRECT_URI.startsWith("https:"),
                maxAge: 3600000  // 1 hour in milliseconds
            });
    
            return res.redirect(CLIENT_CALLBACK_URL);
    
        } catch (error) {
            logger(error, 'error');
            // TODO dont send error back to client, may leak data
            return res.status(500).send(`Failed to fetch access token`);
        }
    } catch (error) {
        logger(error, 'error');
        return res.status(500).send('Something went wrong');
    }
   
});

router.get('/coinbase-balance', async (req, res) => {
    try {
        const ACCESS_TOKEN = req.cookies.access_token;

        try {
            const headers = {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            };
    
            // Make a request to the Coinbase API to fetch the balance
            const response = await axios.get('https://api.coinbase.com/v2/accounts', { headers: headers });

            const eth_data = response.data.data.filter(
                // @ts-ignore
                (data) => data.balance.currency === 'ETH',
            );
    
            // Extract balance from the response
            const balance = eth_data[0].balance;
    
            return res.json({
                success: true,
                balance: balance,
                response: eth_data
            });
        } catch (error) {
            logger(error, 'error');
            // @ts-ignore
            return res.status(error.response.status).json({
                success: false,
                message: 'Failed to fetch balance from Coinbase'
            });
        }
    } catch (error) {
        logger(error, 'error');
        return res.status(500).send('Something went wrong');
    }
});

router.post('/send-withdrawal', async (req, res) => {
    try {
        const ACCESS_TOKEN = req.cookies.access_token;
        const AMOUNT = req.body.amount;
        const CURRENCY = req.body.currency;
        const CRYPTO_ADDRESS = req.body.crypto_address;
        const ACCOUNT_ID = req.body.accountId;
        const CB_2FA_TOKEN = req.body.cb_2fa_token;

        if (!ACCESS_TOKEN || !AMOUNT) {
            return res.status(400).json({
                success: false,
                message: 'Access token or amount not provided'
            });
        }
    
        const cb2faHeader = CB_2FA_TOKEN ? { 'CB-2FA-TOKEN': CB_2FA_TOKEN } : {};

        try {
            const headers = {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                ...cb2faHeader
            };
    
            const data = {
                type: 'send',
                to: CRYPTO_ADDRESS,
                amount: AMOUNT.toString(),
                currency: CURRENCY
            };
    
            const response = await axios.post(
                `https://api.coinbase.com/v2/accounts/${ACCOUNT_ID}/transactions`, 
                data, 
                { headers: headers });
    
            return res.json({
                success: true,
                transaction: response.data
            });
        } catch (error) {
            
            logger(error, 'error');
            // @ts-ignore
            logger(error.response.data.errors, 'error');
            // @ts-ignore
            return res.status(error.response.status).json({
                success: false,
                // @ts-ignore
                message: error.response.data.errors
            });
        }
    } catch (error) {
        logger(error, 'error');
        return res.status(500).send('Something went wrong');
    }
   
});

export default router;
