const initState = {
    name: 'example'
};

const example = (state = initState, action) => {
    switch (action.type) {
        case 'EXAMPLE_TYPE':
            return {
                ...state
            };
        default:
            return state
    }
};

export default example;