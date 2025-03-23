import { Router } from "express";
import { usersRoutes } from "./user-routes";
import { messageUpsertRoutes } from "./message-upsert-routes";
const routes = Router();
routes.use('/users', usersRoutes);
routes.use('/messages-upsert', messageUpsertRoutes);
export {routes}