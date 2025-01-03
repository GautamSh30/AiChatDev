import * as userService from '../services/user.service.js'
import userModel from '../models/user.model.js';
import {validationResult} from 'express-validator'

export const createUserController = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();
        res.status(201).json({user, token})
    }
    catch(error) {
        res.status(400).send(error.message);
    }
}

export const loginController = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email}).select('+password');
        if(!user) {
            return req.status(401).json({
                errors: 'Invalid credetials'
            })
        }
        const isMatch = await user.isValidPassword(password);
        if(!isMatch) {
            return req.status(401).json({
                errors: 'Invalid credetials'
            })
        }
        const token = await user.generateJWT();
        delete user._doc.password;  
        res.status(200).json({user, token});
    }
    catch(error) {
        res.status(400).send(error.message);
    }
}

export const profileController = async(req, res) => {
    try {
        res.status(200).json({
            user: req.user
        })
    }
    catch(error) {
        res.status(400).send(error.message)
    }
}