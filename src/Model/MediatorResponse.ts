import { MediatorEdge } from "./MediatorEdge"
import { MediatorNode } from "./MediatorNode"

export class MediatorResponse {
    responseHeader: Object;
    responseBody: {
        response: {
            total_found: Number,
            docs: Array<Object>,
        },
        facet: {
            fields: Object
        },
        graph: {
            metadata: Array<Object>,
            nodes: Array<MediatorNode>,
            edges: Array<MediatorEdge>
        }
    };

    constructor() {
        this.responseHeader = {};
        this.responseBody = {
            response: { total_found: 0, docs: [] },
            facet: {
                fields: {}
            },
            graph: {
                metadata: [],
                nodes: [],
                edges: [],
            }
        };
    }
}