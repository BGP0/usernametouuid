const mongoose = require('mongoose');
const axios = require('axios')

mongoose.connect('mongodb+srv://', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const schema = new mongoose.Schema({
	_id: 'String',
	time: 'Array'
},
{
	versionKey: false
})
const AccountOld = mongoose.model('Usernames', schema);

const Account = mongoose.model('UUID', schema);

async function addJoin(id, time) {
	await Account.findByIdAndUpdate(
		{ _id: id },
		{ $push: { time: { $each: time } } },
		{ upsert: true },
	)
}

function find() {
    AccountOld.findOneAndDelete().exec(function (err, result) {
        axios.get(`https://api.mojang.com/users/profiles/minecraft/${result._id}`)
		.then(function (response) {
            var uuid = response.data.id
            if (uuid != undefined) {
                var times = []
                for (i in result.time) { times.push(result.time[i][0]) }
    
                console.log(result._id, uuid)
                addJoin(uuid, times)
            }

		})
		.catch(function (error) {
			console.log(error);
            process.exit(1)
		})

        setTimeout(() => {
            find()
        }, 3000);
    })
}

find()