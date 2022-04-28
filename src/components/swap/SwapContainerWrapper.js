import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { fetchMultiplier, selectMetadataSlice } from '../../redux/slices/multiplier';
import { fetchNearBalance } from '../../redux/slices/near';
import { actions as tokensActions } from '../../redux/slices/tokens';
import SwapAndSuccessContainer from './SwapAndSuccessContainer';

const { fetchTokens } = tokensActions;

const SwapContainerWrapper = ({ accountId }) => {
    const fungibleTokensList = useFungibleTokensIncludingNEAR(accountId);
    const multiplier = useSelector(selectMetadataSlice);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!accountId) {
            dispatch(fetchMultiplier());
            return;
        }
        dispatch(fetchMultiplier());
        dispatch(fetchTokens({ accountId }));
        dispatch(fetchNearBalance(accountId))
       
    }, [accountId]);

    return (
        <SwapAndSuccessContainer
            fungibleTokensList={fungibleTokensList}
            accountId={accountId}
            multiplier={multiplier}
        />
    );
};

export default SwapContainerWrapper;
