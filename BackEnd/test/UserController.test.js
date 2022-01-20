const supertest = require('supertest');
const request = supertest('localhost:8080')

describe('createUser()', () => {
	describe('Rápido:', () => {
		test("CPF inválido, curto demais", async () => {
	
			const user = {cpf: '1234567891', password: '123', name: 'Test', data: 'a'};
			const response = await request.post('/user')
			.send(user).then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('CPF inválido, curto demais');
		
		});
	
		test('Senha vazia', async () => {
	
			const user = {cpf: '12345678910', password: '', name: 'Test', data: 'a'};
			const response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('Senha vazia');
	
		});
	
		test('Nome vazio', async () => {
	
			const user = {cpf: '12345678910', password:'123', name: '', data: 'a'};
			const response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('Nome vazio');
	
		});
	
		test('Role inválida', async () => {
	
			let user = {cpf: '12345678910', password: '123', name: 'Test', data: 'a', role: 3};
			let response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('Role inválida');
	
			user = {cpf: '12345678910', password: '123', name: 'Test', data: 'a', role: -1};
			response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('Role inválida');
		});
	
		test('Medico responsável não informado', async () => {
	
			const user = {cpf: '12345678910', password:'123', name: 'Test', data: ''};
			const response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('Medico responsável não informado');
		});
	
		test('Especialidade não informada', async () => {
	
			const user = {cpf: '12345678910', password:'123', name: 'Test', data: '', role: 1};
			const response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('Especialidade não informada');
		});
	
		test('Dados inválidos', async () => {
	
			const user = {cpf: '12345678910', password:'123', name: 'Test', data: 'AA1'};
			const response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('Dados inválidos');
		});
	});
	
	describe('Lento:', () => {
		test('CPF já registrado', async () => {
	
			const user = {cpf: '00000000000', password:'123', name:'Test', data: 'a'};
			const response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('CPF já registrado');
		});
	
		test('CPF inválido, incorreto', async () => {
			const user = {cpf: '01010101010', password:'123', name:'Test', data: 'a'};
			const response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('CPF inválido, incorreto');
		});
	
		test('Medico não encontrado', async () => {
			const user = {cpf: '99999999999', password:'123', name:'Test', data: 'a'};
			const response = await request.post('/user').send(user)
			.then( res => res).catch(err => console.log(err));
	
			expect(response.statusCode).toEqual(400);
			expect(response.body.err).toEqual('Médico não encontrado');
		});
	});
});

describe('Login()', () => {
	test('Senha inválida', async () => {

		const user = {cpf: '', password: ''};
		const response = await request.post('/login').send(user)
		.then( res => res).catch(err => console.log(err));

		expect(response.statusCode).toEqual(400);
		expect(response.body.err).toEqual('Senha inválida');
	}),

	test('CPF inválido', async () => {

		const user = {cpf: '', password: '123'};
		const response = await request.post('/login').send(user)
		.then( res => res).catch(err => console.log(err));

		expect(response.statusCode).toEqual(400);
		expect(response.body.err).toEqual('CPF inválido');
	}),

	test('Usuario não encontrado', async () => {

		const user = {cpf: '01234567891', password: '123'};
		const response = await request.post('/login').send(user)
		.then( res => res).catch(err => console.log(err));

		expect(response.statusCode).toEqual(400);
		expect(response.body.err).toEqual('Usuário não encontrado');
	}),

	test('Login efetuado com sucesso', async () => {

		const user = {cpf: '00000000000', password:'123'};
		const response = await request.post('/login').send(user)
		.then( res => res).catch(err => console.log(err));

		expect(response.statusCode).toEqual(200);
		expect(response.body.token).toHaveLength(152);
		expect(response.body.userType).toEqual('P');
	});
});

