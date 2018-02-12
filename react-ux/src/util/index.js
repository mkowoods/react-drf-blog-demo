


export const getNowInSeconds = () => Math.round(Date.now()/1000)


//LOCAL STORAGE METHODS

//consider using sessionStorage so the data doesnt persist too long:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
export const loadStateFromLocalStorage = () => {
    try{
        const serializedState = localStorage.getItem("state");
        if(serializedState === null){
            return undefined
        }
        const parsed = JSON.parse(serializedState)
        console.warn("Loaded State From St", parsed)
        return parsed;

    } catch (err){
        console.error("loadState error", err);
        return undefined;
    }
}

export const saveStateToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state",serializedState);
        console.warn("Saved State", state)
    } catch (err) {
        console.error("loadState error", err);
    }
}

