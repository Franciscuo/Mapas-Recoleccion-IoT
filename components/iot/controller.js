const store = require('./store');

const hex_to_ascii=(str1)=>{
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}

const addData = (userName,name, lastName,email,password)=>{
    return new Promise(async(resolve, reject)=>{
        if (!userName||!name||!lastName||!email||!password){
            reject('Informacion Incorrecta') // retorna promesa
            return false
        }
        const newUser = {
            'userName': userName,
            'name': name,
            'lastName': lastName,
            'email': email,
            'password': password,
            'admin':false,
            'collector':false,
            'date':new Date(),
        }
        store.add(newUser)
            .then((NewUser)=>{
                resolve(NewUser)
            })
            .catch(e=>{
                reject(e)
            })
    })
}

const getData=((filterUser)=>{
    return new Promise(async(resolve, reject)=>{
        store.list(filterUser)
            .then((messages)=>{
                resolve(messages)
            })
            .catch(e=>{
                reject(e)
            })
    })
})

module.exports={
    addUser, 
    getUser,
    updateUser,
    deleteUser,
}