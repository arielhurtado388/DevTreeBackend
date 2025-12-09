import mongoose, { Schema } from "mongoose";

export interface IUsuario {
  nombreUsuario: string;
  nombre: string;
  correo: string;
  password: string;
}

const usuarioSchema = new Schema({
  nombreUsuario: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const Usuario = mongoose.model<IUsuario>("Usuario", usuarioSchema);

export default Usuario;
