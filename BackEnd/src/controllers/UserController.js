const User = require('../models/User');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const secret = require('../database/secret');

module.exports = {
	
	async login(req, res) {
		const { cpf , password } = req.body;

		if(password == undefined || password.length == 0 || password == ' '){
			res.status(400);
			return res.json({err: 'Senha inválida'});
		}

		if(cpf.length == 11){
			const isUser = await User.findByCpf(cpf);
			
			if(isUser.status){
				const isPasswordWright = await bcrypt.compare(password.toString(), isUser.user.password);
				
				if(isPasswordWright){
					const userType = isUser.user.userType;
					const token = jwt.sign({cpf, userType}, secret);

					res.status(200);
					return res.json({token: token, userType: userType});
				}

			} else {
				res.status(400);
				return res.json({err: 'Usuário não encontrado'});
			}

		} else {
			res.status(400);
			return res.json({err: 'CPF inválido'});
		}

	},

	async createUser(req, res) {
		const cpf = req.body.cpf.toString();
		const { password, name, data } = req.body;
		let role = req.body.role;
		// Data pode ser tanto a especialidade do médico quanto o medico responsável
		// Quem nos dirá qual é será baseado na role, ou seja se for médico == especialidade
		// Se for paciente == medico responsável

		// Verificação rápida de erros:
		if(cpf.length != 11){
			res.status(400);
			return res.json({err: 'CPF inválido, curto demais'});
		}

		if(password == undefined || password.length == 0 || password == ' '){
			res.status(400);
			return res.json({err: 'Senha vazia'});
		}

		if(name == undefined || name.length == 0 || name == ' '){
			res.status(400);
			return res.json({err: 'Nome vazio'});		
		}

		if(role == undefined){
			role = 0;
		} else if(role < 0 || role > 2){
			res.status(400);
			return res.json({err: 'Role inválida'});
		}

		if(data == undefined || data.length == 0 || data == ' '){
			res.status(400); 
			return role == 0 ? res.json({err: 'Medico responsável não informado'}) : res.json({err: 'Especialidade não informada'});
		} else {
			const isDataOk = validator.isAlpha(data);
			if(isDataOk == false){
				res.status(400);
				return res.json({err: 'Dados inválidos'});
			}
		}
		
		// Verificação mais lenta de erros:
		try{
			const isCpfRegistered = await User.findByCpf(cpf);

			if(isCpfRegistered.status){
				res.status(400);
				return res.json({err: 'CPF já registrado'});
			}	

		} catch(err) {
			res.status(500);
			return res.json({err: err, errMsg: 'Erro durante a verificação existente de CPF'});
		}

		try{
			const isCpfValid = await User.validateCpf(cpf);
			
			if(isCpfValid == false){
				res.status(400);
				return res.json({err: 'CPF inválido, incorreto'});
			}

		} catch(err) {
			res.status(500);
			return res.json({err: err, errMsg: 'Erro durante a autenticação do CPF'})
		}
		
		if(role == 0){
			try{
				const isMedicoRegistered = await User.findMedByName(data);
				
				if(isMedicoRegistered == false){
					res.status(400);
					return res.json({err: 'Médico não encontrado'});
				}

			} catch(err){
				console.error(err);
				res.status(500);
				return res.json({err: 'Erro durante a verificação existente do médico'});
			}
		}

		// Agora vamos começar a criar o usuário
		const hashedPassword = await bcrypt.hash(password.toString() , 12);

		try{
			await User.create(cpf, hashedPassword, name, role, data);
		} catch(err){
			res.status(500);
			return res.json({err: err, errMsg: 'Erro durante a criação do usuário'});
		}

		res.status(200);
		res.send('Cadastro concluído com sucesso');

	}

}

