// theme.js

// Action types
export const TOGGLE_THEME = 'TOGGLE_THEME';

// Action creators
export const toggleTheme = () => ({
  type: TOGGLE_THEME,
});

// Reducer
const initialState = {
  isDarkMode: false,
};

export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return { ...state, isDarkMode: !state.isDarkMode };
    default:
      return state;
  }
};
