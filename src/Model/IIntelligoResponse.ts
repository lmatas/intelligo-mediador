import { IntelligoEdge } from "./IntelligoEdge"
import { IntelligoNode } from "./IntelligoNode"

export interface IIntelligoResponse {
    responseHeader: Object,
    response: {
        numFound: Number,
        docs: Array<Object>,
    },
    facet_counts: {
        facet_fields: Object
    },
    graph: {
        metadata: Array<Object>,
        nodes: Array<IntelligoNode>,
        edges: Array<IntelligoEdge>
    }
}