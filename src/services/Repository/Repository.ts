import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { getIntelligoFormatContentLanguage, getIntelligoFormatFilter, getIntelligoFormatGraphLanguage, getIntelligoFormatQuery, getIntelligoFormatRelatedLanguage, getMediatorFormat, getMediatorNodeFormat, isValidIntelligoNodeResponse, isValidIntelligoResponse, isNumberOrStringNumber, isValidIntelligoDocsResponse, getMediatorDocsFormat } from '../../utils/Functions';
import { logger } from '../../utils/Logger';
import { IntelligoResponse } from '../../Model/IntelligoResponse';
import { IntelligoNodeResponse } from '../../Model/IntelligoNodeResponse';
import { IntelligoDocsResponse } from '../../Model/IntelligoDocsResponse';

const headUrl = "http://repos.explora-intelligo.info/ws/scielo/";
const tailUrl = "&graph.min_entropy=0.55&graph.max_entropy=1&graph.min_occurrence=3&&wt=json";

const headUrlDocs = "http://repos.explora-intelligo.info/ws/scielo/select/";
const tailUrlDocs = "&wt=json";

class Repository {
    public resolveQuery(req: Request, res: Response, next: NextFunction) {
        let query = req.query.query;
        let lang = req.params.lang;

        if (!lang || lang == '') {
            return res.status(400).send('the language is required');
        }
        if (!query || query == '') {
            return res.status(400).send('the query es required');
        }

        query = getIntelligoFormatQuery(query);
        lang = getIntelligoFormatGraphLanguage(lang);

        if (!lang) {
            return res.status(400).send('the language is required');
        }

        let url = headUrl + lang + "/?q=" + query + tailUrl;

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
            return res.status(400).send('the query es required');
        }

        if (!isNumberOrStringNumber(page_size) || page_size < 0 || !isNumberOrStringNumber(page_number) || page_number < 1) {
            return res.status(400).send('No data in the request');
        }

        page_number = page_size * (page_number - 1);
        query = getIntelligoFormatQuery(query);
        let url = headUrlDocs + "?q=" + query + '&rows=' + page_size + '&start=' + page_number + tailUrlDocs;
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
        let lang = req.params.lang;


        if (!lang || lang == '') {
            return res.status(400).send('the language is required');
        }
        if (!query || query == '') {
            return res.status(400).send('the query is required');
        }
        if (!filter || filter == '') {
            return res.status(400).send('the filter is request');
        }

        query = getIntelligoFormatQuery(query);
        filter = getIntelligoFormatFilter(filter);
        lang = getIntelligoFormatGraphLanguage(lang);

        if (!lang) {
            return res.status(400).send('the language is required');
        }

        let url = headUrl + lang + "/?q=" + query + "&" + filter + tailUrl;

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
            return res.status(400).send('the query is required');
        }
        if (!filter || filter == '') {
            return res.status(400).send('the filter is request');
        }

        if (!isNumberOrStringNumber(page_size) || page_size < 0 || !isNumberOrStringNumber(page_number) || page_number < 1) {
            return res.status(400).send('the pagination "page_size" and "page_number" is required');
        }

        query = getIntelligoFormatQuery(query);
        filter = getIntelligoFormatFilter(filter);

        page_number = page_size * (page_number - 1);

        let url = headUrlDocs + "?q=" + query + "&" + filter + '&rows=' + page_size + '&start=' + page_number + tailUrlDocs;

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
        let lang = req.params.lang;

        if (!lang || lang == '') {
            return res.status(400).send('the language is required');
        }
        if (!query || query == '') {
            return res.status(400).send('No data in the request');
        }
        if (!node || node == '') {
            return res.status(400).send('No data in the request');
        }

        node = getIntelligoFormatContentLanguage(lang) + ":" + node;
        lang = getIntelligoFormatRelatedLanguage(lang);

        if (!lang) {
            return res.status(400).send('the language is required');
        }

        query = getIntelligoFormatQuery(query);
        query = "%2B(" + query + ")%2B";

        let url = headUrl + lang + "/?q=" + query + node + "&wt=json";

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

export default new Repository();