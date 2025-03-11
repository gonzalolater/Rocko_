'use client';

import {
  ADD_ALERT,
  ALERT_OFF,
  DELETE_ALERT,
  UPDATE_ALERT,
  CLEAR_ALERT,
} from '@/constants/alertType';
import {
  AlertContextValues,
  AprAlertAction,
  AprAlertType,
  BufferAlertAction,
  BufferAlertType,
} from '@/types/type';
import { FC, ReactNode, createContext, useContext, useReducer } from 'react';

const aprAlertInitialState: AprAlertType[] = [];
const bufferAlertInitialState: BufferAlertType[] = [];

function aprAlertReducer(
  state: AprAlertType[],
  action: AprAlertAction,
): AprAlertType[] {
  switch (action.type) {
    case ADD_ALERT:
      // Clone the state to ensure immutability and push the new alert
      return [...state, action.alert];

    case UPDATE_ALERT: {
      // Clone the state to ensure immutability
      const newState = [...state];
      const updatedState = newState.map((alert) => {
        if (alert.id === action.alert.id) {
          return action.alert;
        }
        return alert;
      });
      return updatedState;
    }

    case DELETE_ALERT: {
      // Clone the state to ensure immutability
      const newState = [...state];
      const newStateDelete = newState.filter(
        (alert, index) => index !== action.index,
      );

      return newStateDelete;
    }
    case ALERT_OFF:
      return [];
    case CLEAR_ALERT: {
      state = [];
      return state;
    }
    default:
      return state;
  }
}

function bufferAlertReducer(
  state: BufferAlertType[],
  action: BufferAlertAction,
): BufferAlertType[] {
  switch (action.type) {
    case ADD_ALERT:
      // Clone the state to ensure immutability and push the new alert
      return [...state, action.alert];

    case UPDATE_ALERT: {
      // Clone the state to ensure immutability
      const newState = [...state];

      const updatedState = newState.map((alert) => {
        if (alert.id === action.alert.id) {
          return action.alert;
        }
        return alert;
      });

      return updatedState;
    }
    case DELETE_ALERT: {
      // Clone the state to ensure immutability
      const newState = [...state];

      const newStateDelete = newState.filter(
        (alert, index) => index !== action.index,
      );

      return newStateDelete;
    }

    case ALERT_OFF:
      return [];
    case CLEAR_ALERT: {
      state = [];
      return state;
    }
    default:
      return state;
  }
}

interface AlertProviderProps {
  children: ReactNode;
}

const AlertContext = createContext<AlertContextValues | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlertContext must be used within a AlertProvider');
  }
  return context;
};

const AlertProvider: FC<AlertProviderProps> = ({ children }) => {
  const [aprAlertState, aprAlertDispatch] = useReducer(
    aprAlertReducer,
    aprAlertInitialState,
  );

  const [bufferAlertState, bufferAlertDispatch] = useReducer(
    bufferAlertReducer,
    bufferAlertInitialState,
  );

  return (
    <AlertContext.Provider
      value={{
        aprAlertDispatch,
        aprAlertState,
        bufferAlertState,
        bufferAlertDispatch,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
