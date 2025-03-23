import { Router } from "express";
import {MessageSenderController} from "@/controllers/message-sender-controller";

const messageSenderRoutes = Router()
const messageSenderController = new MessageSenderController();
messageSenderRoutes.post('/', messageSenderController.send);
export { messageSenderRoutes };

