export default class RequestHandler {
    static proccessResponse(response) {
        if(Object.keys(response.data).includes("redirect")) {
            window.location = response.data.redirect;
        }
    }
}