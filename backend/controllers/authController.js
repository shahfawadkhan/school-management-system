import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js'
import Student from '../models/studentModel.js'
import Teacher from '../models/teacherModel.js'

export const register = async (req , res)=>{
    try {
        const {name , email , password , role } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message : 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            role
        })
            res.status(201).json({
            message : 'User registered successfully',
            user
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        let roleDoc = null;

        if (user.role === 'student') {
            roleDoc = await Student.findOne({ user: user._id }).select('_id'); 
        } else if (user.role === 'teacher') {
            roleDoc = await Teacher.findOne({ user: user._id }).select('_id');
        } else if (user.role === 'admin') {
            roleDoc = await User.findOne({ user: user._id }).select('_id'); 
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '11d' }
        );

        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                ...user.toObject(),
                roleDocumentId: roleDoc ? roleDoc._id : null
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req , res)=>{
    try {
        const users = await User.find().select('name email role');
        if(!users){
            return res.status(404).json({message : 'No users found'});
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getProfile = async (req , res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({message : 'User not found'});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const deleteUser = async (req , res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message : "User Not Found"}) 
        }
        if (user.role === "student") {
            await Student.findOneAndDelete({ user: id });
      }

        if (user.role === "teacher") {
            await Teacher.findOneAndDelete({ user: id });
      }
        
        await User.findByIdAndDelete(id);
    
        return res.status(200).json({message : "User Deleted Successfully"})
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}