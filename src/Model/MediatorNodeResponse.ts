export class MediatorNodeResponse {
    responseHeader: Object;
    responseBody: {
        response: {
            total_found: Number,
            docs: Array<Object>,
        }
    };

    constructor() {
        this.responseHeader = {};
        this.responseBody = {
            response: { total_found: 0, docs: [] }
        };
    }
}