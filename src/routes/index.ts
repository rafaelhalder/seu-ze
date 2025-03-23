import { Router } from "express";
import { usersRoutes } from "./user-routes";
import { messageSenderRoutes } from "./message-sender-routes";
const routes = Router();
routes.use('/users', usersRoutes);
routes.use('/messages-sender', messageSenderRoutes);
export {routes}