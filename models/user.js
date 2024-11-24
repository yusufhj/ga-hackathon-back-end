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
        customer_name: {
            type: String,
        },
        segment: {
            type: String,
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