var INITIAL_STATE = {
    loginForm: true,
    loginFormValid: false,
    signUpFormValid: false,
    userSignUp: {},
    userLogin: {
        remember: false,
    }
}

const Auth = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case "CHANGE_VALID_LOGIN_FORM":
            return {
                ...state,
                loginFormValid: action.payload
            }
        case "CHANGE_VALID_SIGNUP_FORM":
            return {
                ...state,
                signUpFormValid: action.payload
            }
        case "TOGGLE_TO_LOGIN":
            return {
                ...state,
                loginForm: action.payload
            }
        case "SET_LOGIN_DATA":
            return {
                ...state,
                userLogin: action.payload ? { ...state.userLogin, ...action.payload } : {}
            }
        case "SET_SIGNUP_DATA":
            return {
                ...state,
                userSignUp: action.payload ? { ...state.userSignUp, ...action.payload } : {}
            }
        default:
            return state;
    }
}

export default Auth;