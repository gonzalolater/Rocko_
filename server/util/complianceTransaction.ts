import axios from 'axios';
import { TRM_API_KEY } from '../constants';
import logger from './logger';
import {  getAddress } from 'ethers';

//https://documentation.trmlabs.com/tag/Supported-Asset-List#section/Assets
enum Asset {
    CompUSDCv3 = 'compound_usdc_v3',
    CompGovernance = 'comp',
    Ether = 'eth',
    USDC = 'usdc',
    WrappedBitcoin = 'wbtc',
    Uniswap = 'uni',
}
// https://documentation.trmlabs.com/tag/Supported-Blockchain-List
export enum Blockchain {
    Ethereum = "ethereum",
}
type ComplianceTransactionResponse = {
    uuid: string,
    //     "accountExternalId":"Client1234",
    //     "alerts":null,"asset":
    //     "btc","assetAmount":"0.03506012",
    //     "chain":"bitcoin",
    //     "counterparties":null,
    //     "destinationAddress":"1LBVuSig83hEBzEuvf7KPyB6dYvAQdfBXQ",
    //     "externalId":"a614a6b3-75b2-4a75-bb4b-5f4801b2ebdc",
    //     "fiatCurrency":"USD","fiatValue":"13124.53",
    //     "onchainReference":"35150e9824c7536ed694ba4e96046c0417047cc25690880b3274d65dfbdf4d09",
    //     "riskScoreLevel":null,
    //     "riskScoreLevelLabel":null,
    //     "screenStatus":"PROCESSING",
    //     "screenStatusFailedReason":null,
    //     "submittedAt":"2024-03-07T22:51:55.144Z",
    //     "timestamp":"2021-03-14T20:21:00.000Z",
    //     "transferType":"CRYPTO_WITHDRAWAL",
    //     "trmAppUrl":"https://my.trmlabs.com/monitoring/transfers/f1d9e9da-c17e-5e1a-b95f-fc65d3f35828",
    //     "uuid":"f1d9e9da-c17e-5e1a-b95f-fc65d3f35828"
}
// https://documentation.trmlabs.com/tag/Transfers#operation/PublicV2TmTransfersPost
export enum TransferType {
    CryptoWithdrawal = "CRYPTO_WITHDRAWAL",
    CryptoDeposit = "CRYPTO_DEPOSIT",
}


const complianceTransaction = async ({
    rockoUserId,
    asset,
    assetAmount,
    chain,
    destinationAddress,
    txHash,
    transferType,
    usdValue,
    network
}: {
    rockoUserId: string,
    asset: Asset,
    assetAmount: string,
    chain: Blockchain,
    destinationAddress: string,
    txHash: string,
    transferType: TransferType,
    usdValue: string,
    network: any

}): Promise<ComplianceTransactionResponse | undefined> => {
    let validAddress: string = "";
    if(network?.name === "mainnet"){
        try {
            validAddress = getAddress(destinationAddress);
        } catch (error) {
            logger(error, 'error');
            return undefined;
        }
        try {
            const resp = await axios({
                method: 'post',
                url: 'https://api.trmlabs.com/public/v2/tm/transfers',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Basic ${Buffer.from(`${TRM_API_KEY}:${TRM_API_KEY}`).toString('base64')}`
                },
                data: {
                  accountExternalId: rockoUserId,
                  asset, // 'btc',
                  assetAmount, // '0.03506012',
                  chain, // 'bitcoin',
                  destinationAddress: validAddress, // '1LBVuSig83hEBzEuvf7KPyB6dYvAQdfBXQ',
                  // The ID that you use to identify the transfer in your own system. 
                  // This field must be unique per transfer. 
                  // Additional transfers using the same externalId will be ignored.
                  externalId: txHash,
                  fiatCurrency: 'USD',
                  fiatValue: usdValue,
                  onchainReference: txHash, // '35150e9824c7536ed694ba4e96046c0417047cc25690880b3274d65dfbdf4d09',
                  // timestamp required
                  // string <date-time> (timestamp)
                  // Onchain transaction timestamp of the transfer to be screened, formatted as an ISO-8601 UTC datetime.
                  timestamp: (new Date()).toISOString(),
                  transferType, // 'CRYPTO_WITHDRAWAL'
                }
              })
        
            const data = resp.data;
    
            return {
                uuid:  data.uuid,
            }
        } catch (error) {
            logger(error, 'error');
        }
    }
    return {uuid: `mock-uuid-${Math.floor(Math.random() * 1000000)}` }

}

export default complianceTransaction;
