import projectModel from '../models/project.model.js'
import userModel from '../models/user.model.js'
import * as projectService from '../services/project.service.js'
import { validationResult } from 'express-validator'

export const createProject = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})

    try {
        const {name} = req.body;
        const loggedInUser = await userModel.findOne({email: req.user.email})
        const userId = loggedInUser._id

        const newProject = await projectService.createProject({name, userId})
        res.status(201).json(newProject)
    }
    catch(err) {
        res.status(400).send(err.message);
    }
}

export const getAllProject = async(req, res) => {
    try {
        const loggedInUser = await userModel.findOne({email: req.user.email})

        const allProjects = await projectService.getAllProject({userId: loggedInUser._id})
        res.status(200).json({projects: allProjects})
    }
    catch(err) {
        res.status(404).json({error: err.message})
    }
}

export const addUserToProject = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})

    try {
        const {users, projectId} = req.body;
        const loggedInUser = await userModel.findOne({email: req.user.email})
        const userId = loggedInUser._id

        const project = await projectService.addUserToProject({users, projectId, userId})
        res.status(200).json(project)
    }
    catch(err) {
        res.status(400).send(err.message)
    }
}
export const getProjectById = async(req, res) => {
    try {
        const {projectId} = req.params;
        const project = await projectService.getProjectById({projectId})
        res.status(200).json({project})
    } catch(err) {
        res.status(400).send(err.message)
    }
}