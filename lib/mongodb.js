// import mongoose from "mongoose"

// const MONGODB_URI = process.env.MONGODB_URI

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
// }

// let cached = global.mongoose

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

// async function connectDB() {
//   if (cached.conn) {
//     return cached.conn
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     }

//       cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       return mongoose
//     })
//   }

//   try {
//     cached.conn = await cached.promise
//   } catch (e) {
//     cached.promise = null
//     throw e
//   }

//   return cached.conn
// }

// export default connectDB



import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(" Please define the MONGODB_URI environment variable inside .env.local");
}


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log(" Reusing existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(" Connecting to MongoDB...");
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(" MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}


mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose runtime error:", err);
});

export default connectDB;
