import dotenv from 'dotenv'

//configuramos dotenv
dotenv.config();

export const port = process.env.PORT
export const url = process.env.MONGOURL
export const jwt_secret = process.env.JWT_SECRET
export const jwt_expires = process.env.JWT_EXPIRES