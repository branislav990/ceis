export const urlReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case "SET_URL":
            return { reactUrl: payload.reactUrl, djangoUrl: payload.djangoUrl };

        default:
            return state;
    }
};
