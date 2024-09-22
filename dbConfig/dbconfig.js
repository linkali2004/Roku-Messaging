import mongoose, { connections } from "mongoose";

export async function connect()
{
    try
    {
        mongoose.connect(process.env.MONGO_URI || '').then(()=>{
            console.log("connected to mongodb");
        },
        err => {
            console.log("Cannot connect to database" + err);
        } 
    );
        const connection = mongoose.connection;

        
    }catch(e)
    {
        console.log("The process cannot proceed due to following error: " + e);
    }
}