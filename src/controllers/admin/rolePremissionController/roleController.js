const Admin = require("../../../models/admin");
const Permission = require("../../../models/permission");
const Role = require("../../../models/role");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

/**
 * @desc    Create a new role
 * @route   POST /api/roles
 * @access  Private/SuperAdmin
 */
exports.createRole = catchAsync(async (req, res, next) => {
    const { name, permissions } = req.body;

    if (!name || !name.trim()) {
        return next(new AppError('Role name is required', 400));
    }
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
        return next(new AppError('At least one permission is required for a role', 400));
    }

    // Check if role name already exists
    const roleExists = await Role.findOne({ name });
    if (roleExists) {
        return next(new AppError(`A role with the name '${name}' already exists`, 400));
    }

    // Verify that all provided permission IDs are valid
    // const foundPermissions = await Permission.find({ '_id': { $in: permissions } });
    // if (foundPermissions.length !== permissions.length) {
    //     return next(new AppError('One or more provided permissions are invalid', 400));
    // }

    const role = await Role.create({
        name,
        permissions,
    });

    res.status(201).json({
        status: true,
        message: 'Role created successfully',
        data: { role },
    });
});

// ----------------------------------------------------------------

/**
 * @desc    Get all roles
 * @route   GET /api/roles
 * @access  Private/SuperAdmin
 */
exports.getAllRoles = catchAsync(async (req, res, next) => {
    // Populate permissions to show details, not just IDs
    const roles = await Role.find({}).populate({
        path: 'permissions',
        select: 'name description' // Select which fields to show from permissions
    }).sort({ name: 1 });

    res.status(200).json({
        status: true,
        message: 'Roles retrieved successfully',
        data: { roles },
    });
});

// ----------------------------------------------------------------

/**
 * @desc    Get a single role by ID
 * @route   GET /api/roles/:id
 * @access  Private/SuperAdmin
 */
exports.getRoleById = catchAsync(async (req, res, next) => {
    const role = await Role.findById(req.params.id).populate({
        path: 'permissions',
        select: 'name description'
    });

    if (!role) {
        return next(new AppError('Role not found with that ID', 404));
    }

    res.status(200).json({
        status: true,
        message: 'Role retrieved successfully',
        data: { role },
    });
});

// ----------------------------------------------------------------

/**
 * @desc    Update a role
 * @route   PUT /api/roles/:id
 * @access  Private/SuperAdmin
 */
exports.updateRole = catchAsync(async (req, res, next) => {
    const { name, permissions } = req.body;
    const role = await Role.findById(req.params.id);

    if (!role) {
        return next(new AppError('Role not found with that ID', 404));
    }

    // Update name if provided
    if (name) {
        role.name = name;
    }

    // Update permissions if provided
    if (permissions && Array.isArray(permissions)) {
        // Verify that all provided permission IDs are valid
        // const foundPermissions = await Permission.find({ '_id': { $in: permissions } });
        // if (foundPermissions.length !== permissions.length) {
        //     return next(new AppError('One or more provided permissions are invalid', 400));
        // }
        role.permissions = permissions;
    }

    const updatedRole = await role.save();

    res.status(200).json({
        status: true,
        message: 'Role updated successfully',
        data: { role: updatedRole },
    });
});

// ----------------------------------------------------------------

/**
 * @desc    Delete a role
 * @route   DELETE /api/roles/:id
 * @access  Private/SuperAdmin
 */
exports.deleteRole = catchAsync(async (req, res, next) => {
    const roleId = req.params.id;
    const role = await Role.findById(roleId);

    if (!role) {
        return next(new AppError('Role not found with that ID', 404));
    }

    // **IMPORTANT**: Check if any admin is currently assigned this role
    const adminWithRole = await Admin.findOne({ role: roleId });
    if (adminWithRole) {
        const errorMessage = `Cannot delete. Role is assigned to admin '${adminWithRole.name}'.`;
        return next(new AppError(errorMessage, 400));
    }

    await role.deleteOne();

    res.status(200).json({
        status: true,
        message: 'Role removed successfully',
        data: null
    });
});