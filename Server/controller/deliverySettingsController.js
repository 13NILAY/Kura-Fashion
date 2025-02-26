const DeliverySettings = require('../model/deliverySettingsSchema');

const getDeliverySettings = async (req, res) => {
  try {
    const settings = await DeliverySettings.findOne({ isActive: true });
    res.status(200).json(settings || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery settings' });
  }
};

const updateDeliverySettings = async (req, res) => {
  try {
    const { type, minOrderForFreeDelivery, standardDeliveryCharge } = req.body;

    // Validate inputs
    if (type === 'FREE_ABOVE' && (!minOrderForFreeDelivery || minOrderForFreeDelivery <= 0)) {
      return res.status(400).json({ message: 'Invalid minimum order amount' });
    }

    if ((type === 'FREE_ABOVE' || type === 'FIXED') && (!standardDeliveryCharge || standardDeliveryCharge < 0)) {
      return res.status(400).json({ message: 'Invalid delivery charge' });
    }

    // Deactivate all existing settings
    await DeliverySettings.updateMany({}, { isActive: false });

    // Create new settings
    const newSettings = await DeliverySettings.create({
      type,
      minOrderForFreeDelivery: type === 'FREE_ABOVE' ? minOrderForFreeDelivery : 0,
      standardDeliveryCharge: type === 'FREE_ALL' ? 0 : standardDeliveryCharge,
      isActive: true
    });

    res.status(201).json(newSettings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery settings' });
  }
};

module.exports = {
  getDeliverySettings,
  updateDeliverySettings
};
