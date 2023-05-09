const bcrypt = require('bcryptjs');

import { apiHandler } from '../../../helpers/api/api-handler';
import { usersRepo } from '../../../helpers/api/users-repo';

export default apiHandler({
    post: register
});

function register(req, res) {
    // split out password from user details
    const { password, ...user } = req.body;


    // Check Company Inst Active in the System

    // validate
    if (usersRepo.find(x => x.emal === user.email))
        throw `User with the username "${user.email}" already exists`;

    // hash password
    user.hash = bcrypt.hashSync(password, 10);

    usersRepo.create(user);

    return res.status(200).json({});
}