import RegistrationLog from '../models/RegistrationLog.model.js';

// @desc    Get all registration logs with pagination and filters
// @route   GET /api/registration-logs
// @access  Private (Admin/Manager)
export const getRegistrationLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.registrationSource) filter.registrationSource = req.query.registrationSource;
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: 'i' };
    }
    if (req.query.dateFrom) filter.registeredAt = { ...filter.registeredAt, $gte: new Date(req.query.dateFrom) };
    if (req.query.dateTo) filter.registeredAt = { ...filter.registeredAt, $lte: new Date(req.query.dateTo) };

    const logs = await RegistrationLog.find(filter)
      .populate('user', 'name email role status')
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RegistrationLog.countDocuments(filter);

    res.json({
      success: true,
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single registration log
// @route   GET /api/registration-logs/:id
// @access  Private (Admin/Manager)
export const getRegistrationLog = async (req, res, next) => {
  try {
    const log = await RegistrationLog.findById(req.params.id)
      .populate('user', 'name email role status registeredAt');

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Registration log not found'
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
};

