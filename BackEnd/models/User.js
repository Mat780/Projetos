const knex = require('../database/connection');
const database = require('../database/connection');

module.exports = {

	async findByCpf(cpf){

		try{
			const result = await database.select(['id', 'userType']).where({cpf: cpf}).table("usuarios");

			if(result.length == 0){
				return {status: false, err: 'Usuario não encontrado'}
			}  
			console.log(result);
			return {status: true, user: result};

		} catch(err) {
			console.error(err);
			throw err;
		}
		
	},

	async findMedByName(name){

		try{
			const result = await database.select(['userType']).where({name: name}).table("usuarios");

			if(result.length == 0 || result == 'P'){
				return false;
			} else if(result == 'M'){
				return true
			}

		} catch(err) {
			console.error(err);
			throw err;
		}

	},

	async validateCpf(strCPF){
		let soma = 0;
        let resto;
        let i;
        
        if (!strCPF ||
            strCPF.length != 11
            // || strCPF == "00000000000"
            // || strCPF == "11111111111"
            // || strCPF == "22222222222"
            // || strCPF == "33333333333"
            // || strCPF == "44444444444"
            // || strCPF == "55555555555"
            // || strCPF == "66666666666"
            // || strCPF == "77777777777"
            // || strCPF == "88888888888"
            // || strCPF == "99999999999" 
        ){ return false; }

        for (i=1; i<=9; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11))  resto = 0;
        if (resto != parseInt(strCPF.substring(9, 10)) ) return false;

        soma = 0;
        for (i = 1; i <= 10; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11))  resto = 0;
        if (resto != parseInt(strCPF.substring(10, 11) ) ) return false;

        return true;
	},

	async create(cpf, password, name, role, data) {

		try {
			await database.transaction(async trans => {
				let realRole;
				if(role == 0){
					realRole = 'P'
				} else if(role == 1){
					realRole = 'M'
				} else if(role == 2){
					realRole = 'A'
				}

				await trans.insert({cpf, password, name, userType: realRole}).table('usuarios').then(async id => {

					if(role == 0){
						await trans.insert({respMed: data, idUser: id}).table('pacientes');
					} else {
						await trans.insert({spec: data, idUser: id}).table('medicos');
					}

				})

			})
		} catch(err) {
			console.error(err);
			throw err;
		}

		return;

	}

}