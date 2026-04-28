import {LobbyError} from '@/lobby/LobbyErrors';

export type LobbyIndexState = {
    isCreating: boolean;
    isJoining: boolean;
    error: LobbyError | null;
};

export const initialLobbyIndexState: LobbyIndexState = {
    isCreating: false,
    isJoining: false,
    error: null,
};

export type LobbyIndexAction =
    | { type: 'CREATE_STARTED' }
    | { type: 'CREATE_FAILED'; error: LobbyError }
    | { type: 'JOIN_STARTED' }
    | { type: 'JOIN_FAILED'; error: LobbyError }
    | { type: 'ERROR_DISMISSED' };

export function lobbyIndexReducer(state: LobbyIndexState, action: LobbyIndexAction): LobbyIndexState {
    switch (action.type) {
        case 'CREATE_STARTED':
            return {...state, isCreating: true, error: null};
        case 'CREATE_FAILED':
            return {...state, isCreating: false, error: action.error};
        case 'JOIN_STARTED':
            return {...state, isJoining: true, error: null};
        case 'JOIN_FAILED':
            return {...state, isJoining: false, error: action.error};
        case 'ERROR_DISMISSED':
            return {...state, error: null};
        default:
            return state;
    }
}