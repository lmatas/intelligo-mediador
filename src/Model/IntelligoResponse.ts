import { IntelligoEdge } from "./IntelligoEdge"
import { IntelligoNode } from "./IntelligoNode"

export class IntelligoResponse {
    responseHeader: Object;
    response: {
        numFound: Number,
        docs: Array<Object>,
    };
    facet_counts: {
        facet_fields: Object
    };
    graph: {
        metadata: Array<Object>,
        nodes: Array<IntelligoNode>,
        edges: Array<IntelligoEdge>
    };

    constructor() {
        this.responseHeader = {};
        this.response = {
            numFound: 0,
            docs: [],
        };
        this.facet_counts = {
            facet_fields: {}
        },
            this.graph = {
                metadata: [],
                nodes: [],
                edges: [],
            }
    }
}