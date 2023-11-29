import mongoose from "mongoose";

const connectToMongo = async () => {
    try {
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("database connected successfully!",);
        } else {
            console.log('Mongo URL is not define.', process.env.MONGO_URI);
        }
    } catch (error) {
        console.log("can not connect to the database.", error);
    }
}

export default connectToMongo;