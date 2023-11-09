import { Router } from 'express';
import { CrawlerController } from './crawler.controller';
import { validateSchema } from '../../../common/middlewares/validate';
import { operationSchema, statusSchema } from './middlewares/operations.schema';

export const createCrawlerRouter = () => {
  const router = Router();

  /**
   * @swagger
   * /api/crawling/async-operation:
   *   post:
   *     summary: Post
   *     parameters:
   *       - in: query
   *         name: domain
   *         type: string
   *         required: true
   *         description: Domain
   *     responses:
   *       200:
   *         description: Status
   */
  router.post('/async-operation', validateSchema(operationSchema), CrawlerController.asyncOperation);

  /**
   * @swagger
   * /api/crawling/sync-operation:
   *   post:
   *     summary: Post
   *     parameters:
   *       - in: query
   *         name: domain
   *         type: string
   *         required: true
   *         description: Domain
   *     responses:
   *       200:
   *         description: Status
   */
  router.post('/sync-operation', validateSchema(operationSchema), CrawlerController.syncOperation);

  /**
   * @swagger
   * /api/crawling/status/{id}:
   *   get:
   *     summary: Get status
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Status
   */
  router.get('/status/:id', validateSchema(statusSchema), CrawlerController.getStatusById);

  /**
   * @swagger
   * /api/crawling/clear:
   *   delete:
   *     summary: clear queue
   *     responses:
   *       200:
   *         description: Status
   */
  router.delete('/clear', CrawlerController.clearQueue);

  /**
   * @swagger
   * /api/crawling/terminate:
   *   delete:
   *     summary: terminate queue
   *     responses:
   *       200:
   *         description: Status
   */
  router.delete('/terminate', CrawlerController.terminateQueue);

  return router;
};
