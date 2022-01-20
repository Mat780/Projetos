const jwt = require('jsonwebtoken');
const secret = require('../database/secret');

module.exports = (req, res, next) => {
	
    const authToken = req.headers['authorization'];

    if(authToken != undefined){

        const bearer = authToken.split(' ');

		const decoded = jwt.verify(bearer[1], secret);

		if(decoded.userType === 'M' || decoded.userType === 'A'){
			next();
		}else{
			res.status(403);
			return res.json({err: "Você não tem permissão para isso!"});
		}

    }else{
        res.status(403);
        return res.json({err: "Você não está autenticado"});
    }
}
