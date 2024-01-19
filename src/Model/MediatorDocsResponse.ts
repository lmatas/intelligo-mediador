export class MediatorDocsResponse {
    responseHeader: Object;
    responseBody: {
        response: {
            total_found: Number,
            page_size: Number,
            page_number: Number,
            last_page_number: Number,
            docs: Array<Object>,
        },
    };

    constructor() {
        this.responseHeader = {};
        this.responseBody = {
            response: { 
                total_found: 0,
                page_size: 0,
                page_number: 0,
                last_page_number: 0,
                docs: [] 
            },
        };
    }
}