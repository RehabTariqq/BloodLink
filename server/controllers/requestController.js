const Notification = require('../models/Notification');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const BloodUnit = require('../models/BloodUnit');

// @desc    Create a new blood request
// @route   POST /api/requests
// @access  Private (doctor, nurse, bloodBankStaff, hospitalAdmin, superAdmin)
const createRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      urgency,
      department,
      requiredDate,
      notes,
      hospital
    } = req.body;

    if (!patientName || !bloodGroup || !unitsRequired || !requiredDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Patient name, blood group, units required, and required date are required'
      });
    }

    const request = await BloodRequest.create({
      requestedBy: req.user._id,
      hospital: hospital || null,
      patientName,
      bloodGroup,
      unitsRequired,
      urgency: urgency || 'routine',
      department,
      requiredDate,
      notes
    });
     if (request.urgency === 'emergency') {
      const staff = await User.find({ role: { $in: ['bloodBankStaff', 'hospitalAdmin', 'superAdmin'] } });
      const notifications = staff.map((s) => ({
        user: s._id,
        type: 'emergency',
        title: 'Emergency Blood Request',
        message: `${request.patientName} needs ${request.unitsRequired} unit(s) of ${request.bloodGroup} urgently.`
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }
    res.status(201).json({
      status: 'success',
      data: request
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all blood requests (paginated, filterable)
// @route   GET /api/requests
// @access  Private (staff roles)
const getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.urgency) filter.urgency = req.query.urgency;
    if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
    if (req.query.hospital) filter.hospital = req.query.hospital;

    const requests = await BloodRequest.find(filter)
      .populate('requestedBy', 'name role')
      .populate('hospital', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ urgency: 1, createdAt: -1 });

    const total = await BloodRequest.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      count: requests.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requestedBy', 'name role')
      .populate('hospital', 'name')
      .populate('issuedUnits');

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update request status (approve, reject, cancel, etc.)
// @route   PUT /api/requests/:id
// @access  Private (staff roles)
const updateRequestStatus = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found'
      });
    }

    const allowedUpdates = ['status', 'notes'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        request[field] = req.body[field];
      }
    });

    await request.save();

    res.status(200).json({
      status: 'success',
      data: request
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Issue a blood unit against a request
// @route   POST /api/requests/:id/issue
// @access  Private (bloodBankStaff, hospitalAdmin, superAdmin)
const issueUnitToRequest = async (req, res) => {
  try {
    const { unitId } = req.body;

    if (!unitId) {
      return res.status(400).json({
        status: 'error',
        message: 'unitId is required'
      });
    }

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found'
      });
    }

    const unit = await BloodUnit.findById(unitId);
    if (!unit) {
      return res.status(404).json({
        status: 'error',
        message: 'Blood unit not found'
      });
    }

    if (unit.status !== 'available') {
      return res.status(400).json({
        status: 'error',
        message: `Blood unit is not available (current status: ${unit.status})`
      });
    }

    if (unit.bloodGroup !== request.bloodGroup) {
      return res.status(400).json({
        status: 'error',
        message: 'Blood group of unit does not match the request'
      });
    }

    // Mark the unit as issued
    unit.status = 'issued';
    unit.issuedTo = request.patientName;
    unit.issuedDate = new Date();
    await unit.save();

    // Attach the unit to the request and update fulfillment progress
    request.issuedUnits.push(unit._id);
    request.unitsFulfilled += 1;

    if (request.unitsFulfilled >= request.unitsRequired) {
      request.status = 'fulfilled';
    } else {
      request.status = 'partially_fulfilled';
    }

    await request.save();

    res.status(200).json({
      status: 'success',
      data: request
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
// @desc    Delete a blood request (patient record)
// @route   DELETE /api/requests/:id
// @access  Private (staff roles only)
const deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ status: 'error', message: 'Request not found' });
    }
    await request.deleteOne();
    res.status(200).json({ status: 'success', message: 'Request deleted' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  issueUnitToRequest,
  deleteRequest
};