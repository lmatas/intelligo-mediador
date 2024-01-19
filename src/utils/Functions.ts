import { IntelligoResponse } from '../Model/IntelligoResponse'
import { logger } from "../utils/Logger";
import Ajv from 'ajv';
import { MediatorResponse } from '../Model/MediatorResponse';
import { MediatorDocsResponse } from '../Model/MediatorDocsResponse';
import { MediatorNode } from '../Model/MediatorNode';
import { MediatorEdge } from '../Model/MediatorEdge';
import { IntelligoNodeResponse } from '../Model/IntelligoNodeResponse';
import { IntelligoDocsResponse } from '../Model/IntelligoDocsResponse';
import { MediatorNodeResponse } from '../Model/MediatorNodeResponse';
const ajv = new Ajv();
const connectors = ['AND', 'OR', 'NOT'];
const graphLanguages = { 'es': 'graph_es', 'en': 'graph_en', 'pt': 'graph_pt' };
const relatedLanguages = { 'es': 'related_es', 'en': 'related_en', 'pt': 'related_pt' };
const contentLanguages = { 'es': 'contents_es', 'en': 'contents_en', 'pt': 'contents_pt' };

export function getIntelligoFormatGraphLanguage(language: string) {
    if (language.toLocaleLowerCase() in graphLanguages)
        return graphLanguages[language.toLocaleLowerCase()];
    else
        return null;
}

export function getIntelligoFormatRelatedLanguage(language: string) {
    if (language.toLocaleLowerCase() in relatedLanguages)
        return relatedLanguages[language.toLocaleLowerCase()];
    else
        return null;
}

export function getIntelligoFormatContentLanguage(language: string) {
    if (language.toLocaleLowerCase() in contentLanguages)
        return contentLanguages[language.toLocaleLowerCase()];
    else
        return null;
}

export function getIntelligoFormatQuery(query: string) {
    let queryArray = query.split(' ');
    queryArray = queryArray.map(function (element: string) {
        if (connectors.includes(element.toUpperCase()))
            return element.toUpperCase();
        else
            return element;
    });
    return encodeURIComponent(queryArray.join(' '));
}

export function getIntelligoFormatFilter(filter: string) {
    let queryArray = filter.split('&');
    queryArray = queryArray.map(function (element: string) {

        let filterDataPos = element.indexOf(":");
        let filterArg = element.substring(0, filterDataPos);
        let filterData = element.substring(filterDataPos + 1, element.length);

        let aux = filterData.substring(0, 1);
        let aux1 = filterData.substring(0, 1) == filterData.substring(filterData.length - 1);

        if (aux != '"' && aux != "'") {
            
            return "fq=" + encodeURIComponent(filterArg + ':"' + filterData + '"');
        }else if (aux == "'" && aux1){
            return "fq=" + encodeURIComponent(filterArg + ':"' + filterData.substring(1, filterData.length-1) + '"');
        }
        return "fq=" + encodeURIComponent(element);
    });
    return queryArray.join('&');
}

export function isValidIntelligoResponse(responseData: Object) {
    let schema = {
        type: "object",
        properties: {
            "responseHeader": { type: "object" },
            "response": {
                type: "object",
                properties: {
                    "numFound": { type: "number" },
                    "docs": { type: "array" },
                },
                required: ["numFound", "docs"]
            },
            "facet_counts": {
                type: "object",
                properties: {
                    "facet_fields": { type: "object" },
                },
                required: ["facet_fields"]
            },
            "graph": {
                type: "object",
                properties: {
                    "metadata": { type: "array" },
                    "nodes": { type: "array" },
                    "edges": { type: "array" }
                },
                required: ["metadata", "nodes", "edges"]
            },
        },
        required: ["responseHeader", "response", "facet_counts", "graph"],
    }

    const validate = ajv.compile(schema)
    const result = validate(responseData);
    if (!result) {
        logger.error(validate.errors);
    }
    return result;
}

export function isValidIntelligoDocsResponse(responseData: Object) {
    let schema = {
        type: "object",
        properties: {
            "responseHeader": { type: "object" },
            "response": {
                type: "object",
                properties: {
                    "numFound": { type: "number" },
                    "start": { type: "number" },
                    "docs": { type: "array" },
                },
                required: ["numFound", "docs"]
            }
        },
        required: ["responseHeader", "response"],
    }

    const validate = ajv.compile(schema)
    const result = validate(responseData);
    if (!result) {
        logger.error(validate.errors);
    }
    return result;
}


export function isValidIntelligoNodeResponse(nodeResponseData: Object) {
    let schema = {
        type: "object",
        properties: {
            "responseHeader": { type: "object" },
            "response": {
                type: "object",
                properties: {
                    "numFound": { type: "number" },
                    "docs": { type: "array" },
                },
                required: ["numFound", "docs"]
            }
        },
        required: ["responseHeader", "response"],
    }

    const validate = ajv.compile(schema)
    const result = validate(nodeResponseData);
    if (!result) {
        logger.error(validate.errors);
    }
    return result;
}


/**
 * This function apply a new format to intelligoResponse
 * intelligoResponse is the data obtained from the query to from http://repos.explora-intelligo.info/
 * @param intelligoResponse
 */
export function getMediatorFormat(intelligoResponse: IntelligoResponse) {

    let mediatorResponse = new MediatorResponse();

    mediatorResponse.responseHeader = intelligoResponse.responseHeader;
    mediatorResponse.responseBody.response.total_found = intelligoResponse.response.numFound;
    mediatorResponse.responseBody.response.docs = intelligoResponse.response.docs;


    // new Format for the facet_counts field, used in bar charts
    let facet_fields = intelligoResponse.facet_counts.facet_fields;

    for (const [key, value] of Object.entries(facet_fields)) {
        let dataArray = <Array<any>>value;
        let objectArray = new Array;
        for (let i = 0; i < dataArray.length - 1; i += 2) {
            let obj = { "data": dataArray[i], "value": dataArray[i + 1] };
            objectArray.push(obj);
        }
        facet_fields[key] = objectArray;
    }
    mediatorResponse.responseBody.facet.fields = facet_fields;


    // new Format for the graph field, used in graph chart
    let graph = intelligoResponse.graph;
    let nodes = new Array<MediatorNode>;
    let edges = new Array<MediatorEdge>;

    graph.nodes.forEach(element => {
        let node = new MediatorNode(element.label, element.s, element.cid, element.id);
        nodes.push(node);
    });

    graph.edges.forEach(element => {
        let edge = new MediatorEdge(element.w, element.s, element.t);
        edges.push(edge);
    });

    mediatorResponse.responseBody.graph = {
        metadata: graph.metadata,
        nodes: nodes,
        edges: edges
    };

    return mediatorResponse;
}


/**
 * This function apply a new format to intelligoDocsResponse
 * intelligoResponse is the data obtained from the query to from http://repos.explora-intelligo.info/
 * @param IntelligoDocsResponse
 */
export function getMediatorDocsFormat(intelligoDocsResponse: IntelligoDocsResponse) {

    let mediatorDocsResponse = new MediatorDocsResponse();
    let page_number = Math.floor(intelligoDocsResponse.response.start / intelligoDocsResponse.responseHeader.params.rows) +1;
    let last_page_number = Math.ceil(intelligoDocsResponse.response.numFound / intelligoDocsResponse.responseHeader.params.rows);

    mediatorDocsResponse.responseHeader = intelligoDocsResponse.responseHeader;
    mediatorDocsResponse.responseBody.response.total_found = intelligoDocsResponse.response.numFound;
    mediatorDocsResponse.responseBody.response.page_size = intelligoDocsResponse.responseHeader.params.rows;
    mediatorDocsResponse.responseBody.response.page_number = page_number;
    mediatorDocsResponse.responseBody.response.last_page_number = last_page_number;
    mediatorDocsResponse.responseBody.response.docs = intelligoDocsResponse.response.docs;

    return mediatorDocsResponse;
}

export function getMediatorNodeFormat(intelligoNodeResponse: IntelligoNodeResponse) {

    let mediatorNodeResponse = new MediatorNodeResponse();

    mediatorNodeResponse.responseHeader = intelligoNodeResponse.responseHeader;
    mediatorNodeResponse.responseBody.response.total_found = intelligoNodeResponse.response.numFound;
    mediatorNodeResponse.responseBody.response.docs = intelligoNodeResponse.response.docs;

    return mediatorNodeResponse;
}


export function isNumberOrStringNumber(value) {
    return !isNaN(+value);
}