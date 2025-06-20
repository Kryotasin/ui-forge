import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    pageSelection: string;
    nodeSelection: string;
    componentSelection: string;
    nodeSelectionDataDump: {};
    componentSelectionDump: {};
}

const initialState: AppState = {
    pageSelection: '',
    nodeSelection: '',
    componentSelection: '',
    nodeSelectionDataDump: {},
    componentSelectionDump: {}
};

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setPageSelection: (state, action: PayloadAction<string>) => {
            state.pageSelection = action.payload;
        },
        setNodeSelection: (state, action: PayloadAction<string>) => {
            console.log(action)
            state.nodeSelection = action.payload;
        },

        setNodeSelectionDataDump: (state, action: PayloadAction<any[]>) => {
            state.nodeSelectionDataDump = action.payload;
        },
        setComponentSelection: (state, action: PayloadAction<string>) => {
            state.componentSelection = action.payload;
        },
        setComponentSelectionDump: (state, action: PayloadAction<any>) => {
            state.componentSelectionDump = action.payload;
        },
        setAllStrings: (state, action: PayloadAction<AppState>) => {
            return action.payload;
        },
        clearAllStrings: (state) => {
            state.pageSelection = '';
            state.nodeSelection = '';
            state.componentSelection = '';
            state.nodeSelectionDataDump = [];
        },
    },
});

export const { setPageSelection, setNodeSelection, setNodeSelectionDataDump, setComponentSelection, setAllStrings, clearAllStrings } = dataSlice.actions;
export default dataSlice.reducer;