const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
    }, 
    {   timestamps: true, }
);

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});


const User = mongoose.model('User', userSchema);
module.exports = User;