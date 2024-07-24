import mongoose from "mongoose";

const connectDb = () => {
    mongoose
        .connect(`${process.env.DB_URI}/ECOMMERCE`)
        .then((data) => {
            console.log(
                "mongodb is connected succesfully,",
                data.connection.host
            );
        })
        .catch((err) => {
            console.log("error in db folder\n", err);
        });
};

export default connectDb;
