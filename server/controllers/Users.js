import db from '../db/dbQuery';
import Lib from './Lib';

const User = {
  async create(req, res) {
    if (!req.body.email || !req.body.password || !req.body.name || !req.body.address) {
      return res.status(400).send([{ status: 'fail' }, { message: 'All fields are required' }]);
    }
    if (!Lib.isValidEmail(req.body.email)) {
      return res.status(400).send([{ status: 'fail' }, { message: 'Email is not valid' }]);
    }

    let isAdmin = '';

    if (req.body.email === 'mike@gmail.com') {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
    const encryptPassword = Lib.encryptPassword(req.body.password);

    const createQuery = `INSERT INTO
      users(name, email, password, address, is_admin)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      req.body.name,
      req.body.email,
      encryptPassword,
      req.body.address,
      isAdmin,
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      const token = Lib.generateToken(rows[0].id, rows[0].is_admin);
      return res.status(201).send([{ status: 'successful' }, { message: 'Registration successful, proceed to login' }, { token }]);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send([{ status: 'fail' }, { message: 'EMAIL already exist' }]);
      }
      return res.status(400).send(error);
    }
  },

  // login route
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send([{ status: 'fail' }, { message: 'Some fields are missing ' }]);
    }
    if (!Lib.isValidEmail(req.body.email)) {
      return res.status(400).send([{ status: 'fail' }, { message: 'Please enter a valid email address' }]);
    }
    const loginQuery = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(loginQuery, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).send([{ status: 'fail' }, { message: 'User not found' }]);
      }
      if (!Lib.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send([{ status: 'fail' }, { message: 'Invalid login details' }]);
      }
      const token = Lib.generateToken(rows[0].id, rows[0].is_admin);
      return res.status(200).send([{ status: 'successful' }, { token }, { rows }]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  // async delete(req, res) {
  //   const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
  //   try {
  //     const { rows } = await db.query(deleteQuery, [req.user.id]);
  //     if (!rows[0]) {
  //       return res.status(404).send([{ status: 'fail' }, { message: 'user not found' }]);
  //     }
  //     return res.status(204).send([{ status: 'successful' }, { message: 'deleted' }]);
  //   } catch (error) {
  //     return res.status(400).send(error);
  //   }
  // },
};

export default User;
