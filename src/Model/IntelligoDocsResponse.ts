export class IntelligoDocsResponse {
    responseHeader: {
        status: number,
        QTime: number,
        params: {
            q: string,
            start: number,
            rows: number,
        },
    };
    response: {
        numFound: number,
        start: number,
        docs: Array<Object>,
    };

    constructor() {
        this.responseHeader = {
            status: 0,
            QTime: 0,
            params: {
                q: '',
                start: 1,
                rows: 1,
            },
        };
        this.response = {
            numFound: 0,
            start: 1,
            docs: [],
        };
    }
}