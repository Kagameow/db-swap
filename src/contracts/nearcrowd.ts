// TODO: make v1 scope

import { NearContract } from 'react-near/core/contract';
import { useNearContract } from 'react-near';

export const CONTRACT_ID = 'nearcrowd.testnet';
export const VIEW_METHODS = [
    'is_account_whitelisted',
    'get_account_stats',
    'get_account_state',
    'get_taskset_state',
    'get_current_taskset',
    'get_task_review_state'

    /* OTHER (defined in the original nearcrowd prototype) */
    // 'get_estimated_atto_tasks_per_share',
    // 'cheapest_invite',
    // 'can_push_queue'
];
export const CHANGE_METHODS = [
    'change_taskset',
    'apply_for_assignment',
    'claim_assignment',
    'return_assignment',
    'submit_solution',
    'submit_review'

    /* ADMIN METHODS */
    // 'new',
    // 'add_tasks',
    // 'add_taskset',
    // 'update_taskset_prices',
    // 'update_mtasks_per_second',
    // 'whitelist_account',
    // 'ban_account',
    // 'approve_solution',

    /* OTHER (defined in the original nearcrowd prototype) */
    // 'claim_reward',
    // 'return_own_review',
    // 'remove_duplicate_review',
    // 'submit_approved_solution',
    // 'honeypot_partial_credit',
    // 'finalize_task',
    // 'finalize_challenged_task',
    // 'challenge',
    // 'invite_friend',
    // 'list_invite',
    // 'buy_invite',
    // 'push_queue'
];

export interface AccountStats {
    balance: string;
    successful: number;
    failed: number;
    pending?: number;
    invites?: number;
}

export interface TaskSetState {
    next_price: string;
    wait_time: string;
    num_unassigned: string;
    num_reviews: string;
}

interface Assignment {
    task_hash: string;
    ordinal: number;
}

type AccountStateNonExistent = 'NonExistent';

type AccountStateIdle = 'Idle';

type AccountStateWaitsForAssignment = {
    WaitsForAssignment: {
        bid: string;
        until: string;
    };
};

type AccountStateHasAssignment = {
    HasAssignment: {
        assignment: Assignment;
        bid: string;
        since: string;
    };
};

export type AccountState =
    | AccountStateNonExistent
    | AccountStateIdle
    | AccountStateWaitsForAssignment
    | AccountStateHasAssignment;

export type NEARCrowdContract = NearContract & {
    // TODO: describe all the methods of the contract

    is_account_whitelisted(args: { account_id: string }): Promise<boolean>;
    is_account_banned(args: { account_id: string }): Promise<boolean>;
    get_account_stats(args: { account_id: string }): Promise<AccountStats>;

    change_taskset(args: { new_task_ord: number }): Promise<boolean>;
    apply_for_assignment(args: { task_ordinal: number }): Promise<boolean>;
    // claim_assignment(args: { ? }): Promise<>;
    get_account_state(args: {
        account_id: string;
        task_ordinal: number;
    }): Promise<AccountState>;
    get_taskset_state(args: { task_ordinal: number }): Promise<TaskSetState>;
};

export function useNearcrowdContract() {
    return useNearContract(CONTRACT_ID, {
        viewMethods: VIEW_METHODS,
        changeMethods: CHANGE_METHODS
    }) as NEARCrowdContract;
}
