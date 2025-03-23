import {Request,Response} from "express";
import {z} from "zod";
import {prisma} from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import {hash} from "bcrypt"

class UsersController {
    async create(request: Request, response: Response){
        const bodySchema = z.object({
          name: z.string().trim().min(2, {message: "Nome é obrigatório"}),
          email: z.string().trim().email({message: "Email inválido"}),
          password: z.string().trim().min(6, {message: "Senha deve ter no mínimo 6 caracteres"}),
          number: z.string().trim().min(11, {message: "Número inválido"})
        })

        const {name,email,password, number} = bodySchema.parse(request.body);
        const userWithSameEmail = await prisma.user.findFirst({
            where: {
            email    
            }})

        if(userWithSameEmail){
            throw new AppError("Email already in use")
        }

        const userWithSameNumber = await prisma.user.findFirst({
          where: {
          number
          }})

      if(userWithSameNumber){
          throw new AppError("Number already in use")
      }

        const hashedPassword = await hash(password,8);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                number
            }
        })

        response.status(201).json();
    }
}

export { UsersController }