import axios from 'axios';
import { TRM_API_KEY } from '../constants';
import logger from './logger';
import { getAddress } from 'ethers';

const complianceCheckAddress = async (address: string) => {
    let validAddress: string = "";
    try {
        validAddress = getAddress(address);
    } catch (error) {
        logger(error, 'error');
        return false;
    }

    try {
        const resp = await axios.post(
            'https://api.trmlabs.com/public/v1/sanctions/screening',
            [
                {
                    address: validAddress,
                }
            ],
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + Buffer.from(`${TRM_API_KEY}:${TRM_API_KEY}`).toString('base64')
                },
            }
        );

        const data = resp.data;

        const isSanctioned = data[0].isSanctioned === true;
        const isNotSanctioned =  !isSanctioned;

        if (isSanctioned) {
            logger(`Sanctioned address attempt: ${address}`, 'error');
        }

        return isNotSanctioned;
    } catch (error) {
        logger(error, 'error');
        throw error;
    }
};

export default complianceCheckAddress;