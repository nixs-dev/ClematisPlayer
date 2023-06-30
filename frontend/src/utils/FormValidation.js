export default class FormValidation {

    defaultField = {
        "value": "",
        "minHeight": 0,
        "maxHeight": null,
        "nullable": true
    }

    #validators = {
        "minHeight": (value, minHeight) => value.length >= minHeight,
        "maxHeight": (value, maxHeight) => maxHeight !== null ? value.length <= maxHeight : true,
        "nullable": (value, nullable) => value !== undefined && value !== null && value !== "",
    }

    /*
        fields -> Dictionary
            index -> FieldName
                content -> List
                    (BASED ON defaultField)
    */

    constructor(fields) {
        this.fields = fields;

        for(let field in this.fields) {
            field = { ...this.defaultField, ...field };
        }
    }

    change(fieldName, value) {
        this.fields[fieldName].value = value;

        return this.validateOne(fieldName);
    }

    validateOne(fieldName) {
        let info = this.fields[fieldName];
        
        for(let i in info) {
            if(!(i in this.#validators)) {
                continue;
            }

            if(!this.#validators[i](info.value, info[i])) {
                return { valid: false, content: i }
            }
        }

        return { valid: true, content: null };
    }
}