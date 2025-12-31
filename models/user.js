const { createHmac, randomBytes, hash } = require('crypto');
const {Schema,model} = require('mongoose');
const { createTokenForUser } = require('../services/auth');

const userSchema = new Schema({
    fullname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    salt:{
        type: String,
    },
    profileimageurl:{
        type: String,
        default: "/images/Default.jpg",
    },
    role:{
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER",
    },
    password:{
        type: String,
        required: true,
    },
},{ timestamp: true}
);

userSchema.pre("save",function (next){
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");

    const hashedPassword = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');
    
    this.salt = salt;
    this.password = hashedPassword;
    next();


});

userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("user not found");
    if(!user) return false;
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
               .update(password)
               .digest('hex');

    if(hashedPassword!=userProvidedHash) throw new Error("wrong password");
    // return hashedPassword == userProvidedHash;
    // return user;
    const token = createTokenForUser(user);
    return token;
});


const User = model("user",userSchema);
module.exports = User;