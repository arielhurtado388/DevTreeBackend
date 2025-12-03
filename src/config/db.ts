import colors from "colors";
import mongoose from "mongoose";

export const conexionDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DB_URL);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.magenta.bold(`MongoDB conectada en ${url}`));
  } catch (error) {
    console.log(colors.red.bold(error.message));
    process.exit(1);
  }
};
