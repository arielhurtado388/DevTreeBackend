import mongoose, { Schema, Document } from "mongoose";

export interface IUsuario extends Document {
  nombreUsuario: string;
  nombre: string;
  correo: string;
  password: string;
  descripcion: string;
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
  descripcion: {
    type: String,
    default: "",
  },
});

const Usuario = mongoose.model<IUsuario>("Usuario", usuarioSchema);

export default Usuario;
