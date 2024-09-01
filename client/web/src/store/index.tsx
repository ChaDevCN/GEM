import * as React from 'react';
import { configure } from 'mobx';
import { globalStore } from './global';

configure({ enforceActions: 'always' });

export const stores = { globalStore };

export const storesContext = React.createContext(stores);

export const useStores = () => React.useContext(storesContext);

export const StoresProvider = storesContext.Provider;
