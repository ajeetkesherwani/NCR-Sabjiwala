const Admin = require("../../../models/admin");
const Permission = require("../../../models/permission");
const Role = require("../../../models/role");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const jwt = require('jsonwebtoken');


/**
 * @desc    Create a new Admin
 * @route   POST /api/admins
 * @access  Private/SuperAdmin
 */
exports.createAdmin = catchAsync(async (req, res, next) => {
    const { name, email, phoneNo, password, address, bio, role } = req.body;

    if (!name || !email || !password || !role) {
        return next(new AppError('Please provide name, email, password, and a role', 400));
    }

    // Check if email already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
        return next(new AppError('An admin with this email already exists', 400));
    }

    // Check if the role exists
    const roleExists = await Role.findById(role);
    if (!roleExists) {
        return next(new AppError('Invalid role ID provided', 400));
    }

    const newAdmin = await Admin.create({
        name,
        email,
        phoneNo,
        password,
        address,
        bio,
        role,
    });

    // We don't want to send the password back, even though it's hashed
    newAdmin.password = undefined;

    res.status(201).json({
        status: true,
        message: 'Admin created successfully',
        data: { admin: newAdmin },
    });
});

/**
 * @desc    Get all Admins (excluding Super Admins)
 * @route   GET /api/admins
 * @access  Private/SuperAdmin
 */
exports.getAllAdmins = catchAsync(async (req, res, next) => {
    const admins = await Admin.find({ isSuperAdmin: false }).populate('role', 'name').sort({ createdAt: -1 });

    res.status(200).json({
        status: true,
        message: 'Admins retrieved successfully',
        data: { admins },
    });
});

/**
 * @desc    Get a single Admin by ID
 * @route   GET /api/admins/:id
 * @access  Private/SuperAdmin
 */
exports.getAdminById = catchAsync(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id).populate('role', 'name');

    if (!admin) {
        return next(new AppError('Admin not found with that ID', 404));
    }

    const premission = await Role.findById(admin.role)

    res.status(200).json({
        status: true,
        message: 'Admin retrieved successfully',
        data: { admin, premission },
    });
});

/**
 * @desc    Update an Admin
 * @route   PUT /api/admins/:id
 * @access  Private/SuperAdmin
 */
exports.updateAdmin = catchAsync(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
        return next(new AppError('Admin not found with that ID', 404));
    }

    // Update fields from request body
    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    admin.phoneNo = req.body.phoneNo || admin.phoneNo;
    admin.address = req.body.address || admin.address;
    admin.bio = req.body.bio || admin.bio;
    admin.role = req.body.role || admin.role;
    if (req.body.status !== undefined) {
        admin.isBlocked = req.body.status;
    }

    // If a new password is provided, update it
    if (req.body.password) {
        admin.password = req.body.password;
    }

    const updatedAdmin = await admin.save();
    updatedAdmin.password = undefined;

    res.status(200).json({
        status: true,
        message: 'Admin updated successfully',
        data: { admin: updatedAdmin },
    });
});

/**
 * @desc    Delete an Admin
 * @route   DELETE /api/admins/:id
 * @access  Private/SuperAdmin
 */
exports.deleteAdmin = catchAsync(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
        return next(new AppError('Admin not found with that ID', 404));
    }

    // Prevent a super admin from being deleted
    if (admin.isSuperAdmin) {
        return next(new AppError('Super Admin account cannot be deleted', 400));
    }

    await admin.deleteOne();

    res.status(200).json({
        status: true,
        message: 'Admin deleted successfully',
        data: null
    });
});