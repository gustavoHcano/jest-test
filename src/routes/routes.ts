import { Express, Request, Response } from 'express';
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from '../controller/product.controller';
import { createUserSessionHandler, deleteUserSessionHandler, getUserSessionsHandler } from '../controller/session.controller';
import { createUserHandler } from '../controller/user.controller';
import requireUser from '../middleware/requireUser';
import validateResource from '../middleware/validateResource';
import { createProductSchema, deleteProductSchema, readProductSchema, updateProductSchema } from '../schema/product.schema';
import { createSessionSchema } from '../schema/session.schema';
import { createUserSchema } from '../schema/user.schema';

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

  app.post('/api/users', validateResource(createUserSchema), createUserHandler);


  app.post('/api/sessions', validateResource(createSessionSchema), createUserSessionHandler);

  app.get('/api/sessions', requireUser, getUserSessionsHandler);

  app.delete('/api/sessions', requireUser, deleteUserSessionHandler);


  app.post(
    '/api/products',
    [requireUser,
    validateResource(createProductSchema)],
    createProductHandler
  );
  app.put(
    '/api/products/:productId',
    [requireUser,
    validateResource(updateProductSchema)],
    updateProductHandler
  );
  app.get(
    '/api/products/:productId',
    [validateResource(readProductSchema)],
    getProductHandler
  );
  app.delete(
    '/api/products/:productId',
    [validateResource(deleteProductSchema)],
    deleteProductHandler
  );

}

export default routes;