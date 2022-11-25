import { response } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import ProductModel from '../models/product.model';
import SessionModel from '../models/session.moldel';
import UserModel from '../models/user.model';
import { createProduct } from '../service/product.service';
import connectToDb from '../utils/connect';
import disconnectToDb from '../utils/disconnect';
import { signJWT } from '../utils/jwt.utils';
import createServer from '../utils/server';

beforeAll(async () => {
  try {
    await mongoose.disconnect();;
    connectToDb();

  } catch (error) {
    console.log(error)
  }
});

afterAll((done) => {
  mongoose.disconnect();
  done();
});

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

const productPayload = {
  user: userId,
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  description:
    "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
  price: 879.99,
  image: "https://i.imgur.com/QlRphfQ.jpg",
};

const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

const jwt = signJWT(userPayload);

describe('product', () => {

  describe('get product route', () => {

    describe('given the product does not exist', () => {

      it('should return a 404', (done) => {
        const productId = 'product_123';
        request(app)
          .get(`/api/products/${productId}`)
          .expect(404, done);

      });
    });

    describe('given the product does exist', () => {

      it('should return a status 200 and a product', async () => {
        // @ts-ignore
        const product = await createProduct(productPayload);

        if (product) {
          await request(app)
            .get(`/api/products/${product.productId}`)
            .then((response) => {
              expect(response.statusCode).toBe(200)
              expect(response.body.productId).toBe(product.productId);
            })
        }
      });

    });

  });

  describe('create product route', () => {

    describe('given the user is not logged in ', () => {

      it('should return 403', (done) => {
        request(app)
          .post('/api/products')
          .expect(403, done);
      });

    });


    describe('given the user is logged in ', () => {

      it('should return 200 and create the product', async () =>
        request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${jwt}`)
          .send(productPayload)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(
              {
                "__v": 0,
                "_id": expect.any(String),
                "description": "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
                "image": "https://i.imgur.com/QlRphfQ.jpg",
                "price": 879.99,
                "productId": expect.any(String),
                "title": "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
                "user": expect.any(String),
              }
            );
          }),
      );

    });

  });

});