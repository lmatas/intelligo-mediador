export class IntelligoNodeResponse {
    responseHeader: Object;
    response: {
        numFound: Number,
        docs: Array<Object>,
    };

    constructor() {
        this.responseHeader = {};
        this.response = {
            numFound: 0,
            docs: [],
        };
    }
}