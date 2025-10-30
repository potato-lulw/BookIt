import { Router } from "express";
import { getAllExperienceController, getExpericenceByIdController, createExperienceController } from "../controllers/experience.controller";



const ExperienceRouter = Router()
    .get('/', getAllExperienceController)
    .get('/:id', getExpericenceByIdController)
    .post('/', createExperienceController)

export default ExperienceRouter;