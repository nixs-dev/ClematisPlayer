export function toLoginForm(bool) {
    return {
        type: "TOGGLE_TO_LOGIN",
        payload: bool
    }
}

export function setLoginData(data) {
    return {
        type: "SET_LOGIN_DATA",
        payload: data
    }
}

export function setSignUpData(data) {
    return {
        type: "SET_SIGNUP_DATA",
        payload: data
    }
}