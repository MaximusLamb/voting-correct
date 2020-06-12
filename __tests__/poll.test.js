const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const Poll = require('../lib/models/Poll');
const Organization = require('../lib/models/Organization');

const request = require('supertest');
const app = require('../lib/app');

describe('poll routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let organization;

  beforeEach(async() => {
    organization = await Organization.create({
      title: 'Poll People',
      description: 'People Who Like Colors',
      image: 'placekitten.com'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('create a poll using POST', () => {
    return request(app)
      .post('/api/v1/Polls')
      .send({
        organization: organization._id,
        title: 'Favorite Color',
        description: 'Choose a Favorite Color',
        options: ['red', 'blue', 'green']
      })
      .then(res => {
        expect(res.body).toEqual({
          organization: organization.id,
          _id: expect.anything(),
          title: 'Favorite Color',
          description: 'Choose a Favorite Color',
          options: ['red', 'blue', 'green'],
          __v: 0
        });
      });
  });

  it('lists all polls of the organizations', async() => {

    await Poll.create({
      organization: organization._id,
      title: 'Coolest Dogs',
      options: ['old yeller', 'balto', 'scooby doo']
    })
      .then(() => request(app).get(`/api/v1/polls?organization=${organization.id}`))
      .then(res => {
        expect(res.body).toEqual([{
          organization: {
            _id: expect.anything(),
            title: 'Poll People',
          },
          title: 'Coolest Dogs',
          options: ['old yeller', 'balto', 'scooby doo'],
          _id: expect.anything(),
          __v: 0
        }
        ]);
      });
  });

  it('gets a poll by id', () => {
    return Poll.create({
      organization: organization.id,
      title: 'Coolest Dogs',
      options: ['old yeller', 'balto', 'scooby doo']
    })
      .then(poll => request(app).get(`/api/v1/polls/${poll._id}`))
      .then(res => {
        expect(res.body).toEqual({
          organization: {
            _id: expect.anything(),
            title: 'Poll People',
          },
          _id: expect.anything(),
          title: 'Coolest Dogs',
          options: ['old yeller', 'balto', 'scooby doo'],
          __v: 0
        });
      });
  });

  it('updates a poll', () => {
    return Poll.create({
      organization: organization._id,
      title: 'Sickest Dogs',
      options: ['old yeller', 'balto', 'scooby doo']
    })
      .then(poll => {
        return request(app)
          .patch(`/api/v1/polls/${poll.id}`)
          .send({ options: ['old yeller', 'balto', 'scooby doo', 'snoop'] });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'Sickest Dogs',
          options: ['old yeller', 'balto', 'scooby doo', 'snoop'],
          __v: 0
        });
      });
  });

  it('deletes a poll', () => {
    return Poll.create({
      organization: organization._id,
      title: 'Illest Cats',
      options: ['garfield', 'fritz', 'thunder', 'chicken']
      
    })
      .then(poll => request(app).delete(`/api/v1/polls/${poll.id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'Illest Cats',
          options: ['garfield', 'fritz', 'thunder', 'chicken'],
          __v: 0
        });
      });
  });
});
