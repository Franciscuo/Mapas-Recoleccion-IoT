const userMock = [
  
];

const filteredUserMock= (name) => {
  return userMock.filter(user => user.name.includes(tag));
}

class UserServiceMock {
  async getUser() {
    return Promise.resolve(moviesMock);
  }

  async createUser() {
    return Promise.resolve(moviesMock[0]);
  }
}

module.exports = {
  userMock,
  filteredUserMock,
  UserServiceMock
};
