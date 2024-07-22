const User = require('./db/user');

async function makeDefaultAdmin() {
    const existingAdmin = await User.findOne({ email: 'admin' });
    if (!existingAdmin) {
      const defaultAdmin = new User({
        email: 'admin',
        password: 'admin123',
        role: 'admin'
      })
      await defaultAdmin.save()
    }
    
}

module.exports = makeDefaultAdmin;