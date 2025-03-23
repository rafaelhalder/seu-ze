import { Router } from "express";
import {MessageUpsertController} from "@/controllers/message-upsert-controller";

const messageUpsertRoutes = Router()
const messageUpsertController = new MessageUpsertController();
messageUpsertRoutes.post('/', messageUpsertController.send);
export { messageUpsertRoutes };

