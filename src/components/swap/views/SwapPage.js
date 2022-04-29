import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchMultiplier } from '../../../redux/slices/multiplier';
import FormButton from '../common/FormButtun';
import SwapIconTwoArrows from '../../../assets/svg/SwapIconTwoArrows';
import AvailableToSwap from '../AvailableToSwap';
import { formatNearAmount, formatTokenAmount } from '../formatToken';
import { commission } from '../helpers';
import Loader from '../Loader';
import SwapInfoContainer from '../SwapInfoContainer';
import SwapTokenContainer from '../SwapTokenContainer';
import { useFetchByorSellUSN } from '../../../hooks/fetchByorSellUSN';
import { useNearWallet } from 'react-near';

const { REACT_APP_NEAR_ENV } = process.env;
const contractId  = REACT_APP_NEAR_ENV === 'testnet' ? 'usdn.testnet' : 'usn'

const balanceForError = (from) => {
    return from?.onChainFTMetadata?.symbol === 'NEAR'
        ? +formatNearAmount(from?.balance)
        : +formatTokenAmount(from?.balance, from?.onChainFTMetadata?.decimals, 5);
};

const SwapPage = ({
  from,
  to,
  inputValueFrom,
  setInputValueFrom,
  multiplier,
  accountId,
  onSwap,
  setActiveView
}) => {
    const wallet = useNearWallet();
    const [isSwapped, setIsSwapped] = useState(false);
    const [slippageValue, setSlippageValue] = useState(1);
    const [usnAmount, setUSNAmount] = useState('');
    const { commissionFee, isLoadingCommission } = commission({
        accountId: wallet.account(),
        amount: inputValueFrom,
        delay: 500,
        exchangeRate: + multiplier,
        token: from,
        isSwapped,
    });
    const { fetchByOrSell, isLoading, setIsLoading } = useFetchByorSellUSN(wallet.account());
    const dispatch = useDispatch();
    const balance = balanceForError(from);
    const error = balance < +inputValueFrom || !inputValueFrom;
    const slippageError = slippageValue < 1 || slippageValue > 50;

    const onHandleSwapTokens = useCallback(async (accountId, multiplier, slippageValue, inputValueFrom, symbol, usnAmount) => {
        try {
            setIsLoading(true);
            await fetchByOrSell(accountId, multiplier, slippageValue, +inputValueFrom, symbol, usnAmount);
            setActiveView('success');
        } catch (e) {
            // dispatch(showCustomAlert({
            //     errorMessage: e.message,
            //     success: false,
            //     messageCodeHeader: 'error',
            // }));
            console.error(e.message)
        } finally {
            setIsLoading(false);
            // dispatch(checkAndHideLedgerModal());
        }
    }, []);

    const signIn = () => {
        wallet.requestSignIn({
            contractId: contractId
        })
        .catch(console.error);
    }

    
    return (
        <>
            <div className='wrap'>
                <Loader onRefreshMultiplier={() => dispatch(fetchMultiplier())}/>
                <h1>
                    Swap
                </h1>
            </div>
            
            <SwapTokenContainer
                text="From"
                fromToToken={from}
                value={inputValueFrom}
                setInputValueFrom={setInputValueFrom}
            />
            <AvailableToSwap
                onClick={(balance) => {
                    setInputValueFrom(balance);
                    from?.onChainFTMetadata?.symbol === 'USN' && setUSNAmount(from?.balance);
                }}
                balance={from?.balance}
                symbol={from?.onChainFTMetadata?.symbol}
                decimals={from?.onChainFTMetadata?.decimals}
            />
            <div
                className="iconSwap"
                onClick={() => {
                    onSwap();
                    setIsSwapped((prev) => !prev);
                }}
            >
                <SwapIconTwoArrows
                    width="23"
                    height="23"
                    color="#72727A"
                />
            </div>
            <SwapTokenContainer
                text="To"
                fromToToken={to}
                multiplier={multiplier}
                value={inputValueFrom}
            />
            <SwapInfoContainer
                slippageError={slippageError}
                slippageValue={slippageValue}
                setSlippageValue={setSlippageValue}
                token={from?.onChainFTMetadata?.symbol}
                exchangeRate={+multiplier / 10000}
                amount={inputValueFrom}
                tradingFee={commissionFee?.result}
                isLoading={isLoadingCommission}
                percent={commissionFee?.percent}
            />
            <div className="buttons-bottom-buttons">
                <FormButton
                    type="submit"
                    disabled={!accountId ? false : error || slippageError || isLoading}
                    data-test-id="sendMoneyPageSubmitAmountButton"
                    onClick={() => accountId 
                        ? onHandleSwapTokens(accountId, multiplier, slippageValue, +inputValueFrom, from?.onChainFTMetadata?.symbol, usnAmount)
                        : signIn()}
                    sending={isLoading}
                >
                  {accountId ? <>Swap</> : <>Connect to Wallet</>} 
                </FormButton>
                {/* <FormButton
                    type="button"
                    className="link"
                    color="gray"
                    linkTo="/"
                >
                    <>Cancel</>
                </FormButton> */}
            </div>
        </>
    );
};

export default SwapPage;