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

  it.only('create an poll using POST', () => {
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

//   it('lists all of the organizations', async() => {
//     await Organization.create({
//       title: 'Party Time',
//       description: 'Partiers',
//       image: 'placekitten.com/kitty'
//     });
//     await Organization.create({
//       title: 'Big Time',
//       description: 'Bigly',
//       image: 'placekitten.com/bigkitty'
//     })

//       .then(() => request(app).get('/api/v1/organizations'))
//       .then(res => {
//         expect(res.body).toEqual([{
//           _id: expect.anything(),
//           title: 'Party Time',
//           description: 'Partiers',
//           image: 'placekitten.com/kitty',
//           __v: 0
//         },
//         {
//           _id: expect.anything(),
//           title: 'Big Time',
//           description: 'Bigly',
//           image: 'placekitten.com/bigkitty',
//           __v: 0
//         }]);
//       });
//   });

//   it('gets an organization by id', () => {
//     Organization.create({
//       title: 'Orgatron 5',
//       description: 'Organized'
//     })
//       .then(organization => request(app).get(`/api/v1/organizations/${organization._id}`))
//       .then(res => {
//         expect(res.body).toEqual({
//           _id: expect.anything(),
//           title: 'Orgatron 5',
//           description: 'Organized',
//           __v: 0
//         });
//       });
//   });

//   it('patches an organization', () => {
//     return Organization.create({
//       title: 'Organization',
//       description: 'Organized'
//     })
//       .then(organization => {
//         return request(app)
//           .patch(`/api/v1/organizations/${organization._id}`)
//           .send({ title: 'Organization Supreme', description: 'Organized + Sour Cream' });
//       })
//       .then(res => {
//         expect(res.body).toEqual({
//           _id: expect.anything(),
//           title: 'Organization Supreme',
//           description: 'Organized + Sour Cream',
//           __v: 0
//         });
//       });
//   });

//   it('delete an organization', () => {
//     return Organization.create({
//       title: 'Organization As Heck',
//       description: 'Absolutely Organized'
//     })
//       .then(organization => request(app).delete(`/api/v1/organizations/${organization._id}`))
//       .then(res => {
//         expect(res.body).toEqual({
//           _id: expect.anything(),
//           title: 'Organization As Heck',
//           description: 'Absolutely Organized',
//           __v: 0
//         });
//       });
//   });
});
