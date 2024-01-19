import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { IntelligoResponse } from '../../Model/IntelligoResponse'
import { isValidIntelligoResponse, getMediatorFormat, getIntelligoFormatQuery, getIntelligoFormatFilter, isValidIntelligoNodeResponse, getMediatorNodeFormat, isNumberOrStringNumber, isValidIntelligoDocsResponse, getMediatorDocsFormat } from '../../utils/Functions';
import { logger } from '../../utils/Logger';
import { IntelligoNodeResponse } from '../../Model/IntelligoNodeResponse';
import { IntelligoDocsResponse } from '../../Model/IntelligoDocsResponse';



const headUrl = "http://patentes.explora-intelligo.info/ws/wipo/graph/?q=";
const headUrlRelated = "http://patentes.explora-intelligo.info/ws/wipo/related/?q=";
const tailUrl = "&graph.map_size=300&graph.min_entropy=0.55&graph.max_entropy=1&wt=json";

const headUrlDocs = "http://patentes.explora-intelligo.info/ws/wipo/select/?q=";
const tailUrlDocs = "&wt=json";


class Patent {
    public resolveQuery(req: Request, res: Response, next: NextFunction) {
        let query = req.query.query;

        if (!query || query == '') {
            return res.status(400).send('No data in the request');
        }

        query = getIntelligoFormatQuery(query);
        let url = headUrl + query + tailUrl;

        axios
            .get(url)
            .then((response) => {

                if (!isValidIntelligoResponse(response.data)) {
                    logger.error('the format from data response is invalid');
                    return res.status(500).send('Internal Server Error');
                }

                let intelligoData: IntelligoResponse = response.data;
                return res.status(200).send(getMediatorFormat(intelligoData));

            })
            .catch((err) => {
                logger.error(err);
                return res.status(503).send('Service Unavailable');
            });
    }

    public resolveDocsQuery(req: Request, res: Response, next: NextFunction) {
        let query = req.query.query;
        let page_size = req.query.page_size;
        let page_number = req.query.page_number;

        if (!query || query == '') {
            return res.status(400).send('No data in the request');
        }

        if (!isNumberOrStringNumber(page_size) || page_size < 0 || !isNumberOrStringNumber(page_number) || page_number < 1) {
            return res.status(400).send('No data in the request');
        }

        page_number = page_size * (page_number - 1);

        query = getIntelligoFormatQuery(query);
        let url = headUrlDocs + query + '&rows=' + page_size + '&start=' + page_number + tailUrlDocs;

        axios
            .get(url)
            .then((response) => {

                if (!isValidIntelligoDocsResponse(response.data)) {
                    logger.error('the format from data response is invalid');
                    return res.status(500).send('Internal Server Error');
                }

                let intelligoDocsData: IntelligoDocsResponse = response.data;
                return res.status(200).send(getMediatorDocsFormat(intelligoDocsData));

            })
            .catch((err) => {
                logger.error(err);
                return res.status(503).send('Service Unavailable');
            });
    }

    public resolveFilter(req: Request, res: Response, next: NextFunction) {
        let query = req.query.query;
        let filter = req.query.filter;

        if (!query || query == '') {
            return res.status(400).send('No data in the request');
        }

        if (!filter || filter == '') {
            return res.status(400).send('No data in the request');
        }

        query = getIntelligoFormatQuery(query);
        filter = getIntelligoFormatFilter(filter);

        let url = headUrl + query + "&" + filter + tailUrl;

        axios
            .get(url)
            .then((response) => {

                if (!isValidIntelligoResponse(response.data)) {
                    logger.error('the format from data response is invalid');
                    return res.status(500).send('Internal Server Error');
                }

                let intelligoData: IntelligoResponse = response.data;
                return res.status(200).send(getMediatorFormat(intelligoData));

            })
            .catch((err) => {
                logger.error(err);
                return res.status(503).send('Service Unavailable');
            });
    }

    public resolveDocsFilter(req: Request, res: Response, next: NextFunction) {
        let query = req.query.query;
        let filter = req.query.filter;
        let page_size = req.query.page_size;
        let page_number = req.query.page_number;

        if (!query || query == '') {
            return res.status(400).send('No data in the request');
        }

        if (!filter || filter == '') {
            return res.status(400).send('No data in the request');
        }

        if (!isNumberOrStringNumber(page_size) || page_size < 0 || !isNumberOrStringNumber(page_number) || page_number < 1) {
            return res.status(400).send('No pagination data in the request');
        }

        page_number = page_size * (page_number - 1);

        query = getIntelligoFormatQuery(query);
        filter = getIntelligoFormatFilter(filter);

        let url = headUrlDocs + query + "&" + filter + '&rows=' + page_size + '&start=' + page_number + tailUrlDocs;

        axios
            .get(url)
            .then((response) => {

                if (!isValidIntelligoDocsResponse(response.data)) {
                    logger.error('the format from data response is invalid');
                    return res.status(500).send('Internal Server Error');
                }

                let intelligoDocsData: IntelligoDocsResponse = response.data;
                return res.status(200).send(getMediatorDocsFormat(intelligoDocsData));

            })
            .catch((err) => {
                logger.error(err);
                return res.status(503).send('Service Unavailable');
            });
    }

    public resolveNode(req: Request, res: Response, next: NextFunction) {
        let query = req.query.query;
        let node = req.query.node;

        if (!query || query == '') {
            return res.status(400).send('No data in the request');
        }

        if (!node || node == '') {
            return res.status(400).send('No data in the request');
        }

        node = "contents_en:" + node;

        query = getIntelligoFormatQuery(query);
        query = "%2B(" + query + ")%2B";
        let url = headUrlRelated + query + node + tailUrl;

        axios
            .get(url)
            .then((response) => {

                if (!isValidIntelligoNodeResponse(response.data)) {
                    logger.error('the format from data response is invalid');
                    return res.status(500).send('Internal Server Error');
                }

                let intelligoData: IntelligoNodeResponse = response.data;
                return res.status(200).send(getMediatorNodeFormat(intelligoData));

            })
            .catch((err) => {
                logger.error(err);
                return res.status(503).send('Service Unavailable');
            });
    }
}

export default new Patent();;