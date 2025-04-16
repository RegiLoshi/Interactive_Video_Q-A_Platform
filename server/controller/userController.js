import prismaClient from "../config/prismaClient.js"
import bcrypt from "bcrypt"

const getUser = async (req,res) => {
    const {id} = req.params;
    console.log(id)
    try{
        const user = await prismaClient.user.findUnique({
            where: {
                user_id: id
            },
            select: {
                email: true,
                name: true,
                last_name: true,
                user_id: true,
            }
        })
        console.log(user);
        return res.status(200).json(user);
    }catch(error){
        console.log(error);
        res.status(404).json(error)
    }
}

const updateProfile = async (req, res) => {
    const {id} = req.params;
    const {name, last_name, oldEmail, newEmail, oldPassword, newPassword} = req.body;
    
    console.log('Received update request:', {
        id,
        name,
        last_name,
        oldEmail,
        newEmail,
        oldPassword: oldPassword ? '***' : undefined,
        newPassword: newPassword ? '***' : undefined
    });

    if(req.user.user_id != id){
        return res.status(403).json({
            message: "Forbidden!"
        });
    }

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                user_id: req.user.user_id
            }
        });

        console.log('Current user data:', {
            name: user.name,
            last_name: user.last_name,
            email: user.email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const updateData = {};

        if (name !== undefined && name !== user.name) {
            updateData.name = name.trim();
            console.log('Updating name:', { old: user.name, new: name });
        }

        if (last_name !== undefined && last_name !== user.last_name) {
            updateData.last_name = last_name.trim();
            console.log('Updating last_name:', { old: user.last_name, new: last_name });
        }

        if (newEmail && newEmail !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                return res.status(400).json({
                    message: "Invalid email format"
                });
            }

            const emailExists = await prismaClient.user.findUnique({
                where: {
                    email: newEmail
                }
            });

            if (emailExists) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            updateData.email = newEmail.trim();
            console.log('Updating email:', { old: user.email, new: newEmail });
        }

        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({
                    message: "Current password is required to change password"
                });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Current password is incorrect"
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters long"
                });
            }

            updateData.password = await bcrypt.hash(newPassword, 10);
            console.log('Updating password');
        }

        console.log('Final update data:', updateData);

        if (Object.keys(updateData).length === 0) {
            console.log('No changes to update');
            return res.status(200).json({
                message: "No changes were made",
                user: user
            });
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                user_id: id
            },
            data: updateData,
            select: {
                user_id: true,
                name: true,
                last_name: true,
                email: true,
                role: true
            }
        });

        console.log('Updated user data:', updatedUser);

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            message: "Error updating profile",
            error: error.message
        });
    }
}

export default {getUser, updateProfile};