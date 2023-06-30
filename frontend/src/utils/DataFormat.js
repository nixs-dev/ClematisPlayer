export default class DataFormat {
    static dateToString(date) {
        return `${ date.getDate().toString().padStart(2, "0") }/${ date.getMonth().toString().padStart(2, "0") }/${ date.getFullYear() }`;       
    }

    static secondsToShortTime(seconds) {
        let parts = {
            "hours": 0,
            "minutes": 0,
            "seconds": 0
        };

        parts["minutes"] = Math.floor(seconds/60);
        parts["seconds"] = Math.floor(((seconds/60) - parts["minutes"]) * 60);

        return `${ parts["minutes"].toString().padStart(2, "0") }:${ parts["seconds"].toString().padStart(2, "0") }`;
    }
}