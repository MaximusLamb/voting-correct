const chance = require('chance').Chance();
const Vote = require('../models/Vote');
const Membership = require('../models/Membership');
const Poll = require('../models/Poll');
const User = require('../models/User');
const Organization = require('../models/Organization');


module.exports = async({ 
  votes = 20, 
  memberships = 5,  
  users = 5, 
  organizations = 5 } = {}) => {
    
  const user = await User.create([...Array(users)].map(() => ({ 
    name: chance.name(),
    passwordHash: 'password'
  })));

  const organization = await Organization.create([...Array(organizations)].map(() => ({
    title: (chance.animal() + 'Lovers'),
  })));

  await Membership.create([...Array(memberships)].map(() => ({
    organization: chance.pickone(organization).id,
    user: chance.pickone(user).id
  })));

  const poll = await Poll.create({
    organization: chance.pickone(organization).id,
    title: 'What is your favorite color?',
    options: ['red', 'green', 'blue']
  });

  await Vote.create([...Array(votes)].map(() => ({
    poll: poll.id,
    user: chance.pickone(user).id,
    option: chance.pickone(poll.options)
  })));
  
};

