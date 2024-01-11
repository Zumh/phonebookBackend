const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}  

// get password
const password = process.argv[2]

// established connection
const url = `mongodb+srv://fullstack2024:${password}@cluster0.0mdkycb.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

// create schema like a blue print
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)
  
// if a person want to show all the data from data base
if (process.argv.length<4) {
    // we are going to retrieve all the data
    // log on console and exit
    console.log(`phonebook:`)
    Person.find({}).then(result => {
        
        result.forEach(person => {

            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })

} else {

    // add a new person from command line
    // node mongo.js yourpassword Anna 040-1234556
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}

