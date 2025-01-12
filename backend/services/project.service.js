import mongoose from 'mongoose';
import projectModel from '../models/project.model.js'

export const createProject = async({name, userId}) => {

    if(!name) throw new Error('Name is required')
    if(!userId) throw new Error('User is required')

    let project;
    try {
        project = await projectModel.create({name, users: [userId]})
    } catch(err) {
        if(err.code===11000) throw new Error('Project name already exists')
        throw err
    }

    return project
}

export const getAllProject = async({userId}) => {
    if(!userId) throw new Error('User is required')

    const projects = await projectModel.find({users: userId})
    return projects
}

export const addUserToProject = async({users, projectId, userId}) => {
    if(!users || !projectId || !userId) throw new Error('Users, Project ID and User are required')

    if(!mongoose.Types.ObjectId.isValid(projectId)) throw new Error('Project ID is invalid')

    if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error('User ID is invalid')

    if(!Array.isArray(users) || users.length===0) throw new Error('Users must be an array of at least one element')

    const project = await projectModel.findOne({_id: projectId, users: userId})

    if(!project) throw new Error('Project not found')

    const newUsers = [...project.users, ...users]
    await projectModel.findOneAndUpdate({_id: projectId}, {users: newUsers})

    return projectModel.findOne({_id: projectId})
}

export const getProjectById = async(projectId) => {
    if(!projectId) throw new Error('Project ID is required')

    if(!mongoose.Types.ObjectId.isValid(projectId)) throw new Error('Project ID is invalid')

    const project = await projectModel.findOne({_id: projectId}).populate('users')
    if(!project) throw new Error('Project not found')

    return project
}