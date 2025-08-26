const Permission = require("../../../models/permission");
const Role = require("../../../models/role");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");



/**
 * @desc    Create a new permission
 * @route   POST /api/permissions
 * @access  Private/SuperAdmin
 */
exports.createPermission = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
        return next(new AppError('Permission name is required', 400));
    }

    // Standardize the permission name format
    const formattedName = name.trim().toUpperCase().replace(/\s+/g, '_');

    const permissionExists = await Permission.findOne({ name: formattedName });

    if (permissionExists) {
        return next(new AppError('A permission with this name already exists', 400));
    }

    const permission = await Permission.create({
        name: formattedName,
        description,
    });

    res.status(201).json({
        status: true,
        message: 'Permission created successfully',
        data: { permission },
    });
});

/**
 * @desc    Get all permissions
 * @route   GET /api/permissions
 * @access  Private/Admin
 */
exports.getAllPermissions = catchAsync(async (req, res, next) => {
    const permissions = await Permission.find({}).sort({ name: 1 }); // Sort alphabetically

    res.status(200).json({
        status: true,
        message: 'Permissions retrieved successfully',
        data: { permissions },
    });
});

/**
 * @desc    Get a single permission by ID
 * @route   GET /api/permissions/:id
 * @access  Private/Admin
 */
exports.getPermissionById = catchAsync(async (req, res, next) => {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
        return next(new AppError('Permission not found with that ID', 404));
    }

    res.status(200).json({
        status: true,
        message: 'Permission retrieved successfully',
        data: { permission },
    });
});

/**
 * @desc    Update a permission
 * @route   PUT /api/permissions/:id
 * @access  Private/SuperAdmin
 */
exports.updatePermission = catchAsync(async (req, res, next) => {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
        return next(new AppError('Permission not found with that ID', 404));
    }

    const { name, description } = req.body;

    // Update fields if they are provided in the request body
    if (name && name.trim()) {
        permission.name = name.trim().toUpperCase().replace(/\s+/g, '_');
    }
    if (description) {
        permission.description = description;
    }

    const updatedPermission = await permission.save();

    res.status(200).json({
        status: true,
        message: 'Permission updated successfully',
        data: { permission: updatedPermission },
    });
});


/**
 * @desc    Delete a permission
 * @route   DELETE /api/permissions/:id
 * @access  Private/SuperAdmin
 */
exports.deletePermission = catchAsync(async (req, res, next) => {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
        return next(new AppError('Permission not found with that ID', 404));
    }

    // Check if the permission is being used by any role.
    const roleUsingPermission = await Role.findOne({ permissions: permission._id });

    if (roleUsingPermission) {
        const errorMessage = `Cannot delete. Permission is in use by the "${roleUsingPermission.name}" role.`;
        return next(new AppError(errorMessage, 400));
    }

    await permission.deleteOne();

    res.status(200).json({
        status: true,
        message: 'Permission removed successfully',
        data: null // Or an empty object {}
    });
});