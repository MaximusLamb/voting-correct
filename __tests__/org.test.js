const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const Organization = require('../lib/models/Organization');

const request = require('supertest');
const app = require('../lib/app');

describe('voting routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('create an organization using POST', () => {
    return request(app)
      .post('/api/v1/Organizations')
      .send({
        title: 'Super Org',
        description: 'Super Cool',
        image: 'placekitten.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Super Org',
          description: 'Super Cool',
          image: 'placekitten.com',
          __v: 0
        });
      });
  });

  it('lists all of the organizations', async() => {
    await Organization.create({
      title: 'Party Time',
      description: 'Partiers',
      image: 'placekitten.com/kitty'
    });
    await Organization.create({
      title: 'Big Time',
      description: 'Bigly',
      image: 'placekitten.com/bigkitty'
    })

      .then(() => request(app).get('/api/v1/organizations'))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          title: 'Party Time',
          description: 'Partiers',
          image: 'placekitten.com/kitty',
          __v: 0
        },
        {
          _id: expect.anything(),
          title: 'Big Time',
          description: 'Bigly',
          image: 'placekitten.com/bigkitty',
          __v: 0
        }]);
      });
  });

  it('gets an organization by id', () => {
    Organization.create({
      title: 'Orgatron 5',
      description: 'Organized'
    })
      .then(organization => request(app).get(`/api/v1/organizations/${organization._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Orgatron 5',
          description: 'Organized',
          __v: 0
        });
      });
  });
});
