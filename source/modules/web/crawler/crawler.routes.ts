import { Router } from 'express';
import { CrawlerController } from './crawler.controller';

export const createCrawlerRouter = () => {
  const router = Router();

  /**
   * @swagger
   * /api/crawling/async-operation:
   *   post:
   *     summary: Post
   *     responses:
   *       200:
   *         description: Status
   */
  router.post('/async-operation', CrawlerController.asyncOperation);

  /**
   * @swagger
   * /api/crawling/sync-operation:
   *   post:
   *     summary: Post
   *     responses:
   *       200:
   *         description: Status
   */
  router.post('/sync-operation', CrawlerController.syncOperation);

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
  router.get('/status/:id', CrawlerController.getStatusById);

  /**
   * @swagger
   * /api/crawling/terminate:
   *   delete:
   *     summary: Delete db
   *     responses:
   *       200:
   *         description: Status
   */
  router.delete('/terminate', CrawlerController.deleteDb);

  return router;
};
