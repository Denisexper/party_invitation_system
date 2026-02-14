import mongoose from "mongoose";
import { url } from "../services/enviroments.service.js";

export const connectionDb = async () => {
    try {
        //configuramos la connection
        await mongoose.connect(url)
        console.log('connedted to db')

    } catch (error) {
        console.error(error)
    }
}