const MachinaModels = require('node-machina-ffxiv/models/_MachinaModels');

module.exports = (struct) => {
	struct.classId = MachinaModels.getUint16(struct.data, 0x0);
	struct.isSpecialist = (struct.data[3] === 1) || false;
	struct.syncedLevel = MachinaModels.getUint16(struct.data, 0x4);
	struct.classLevel = MachinaModels.getUint16(struct.data, 0x6);
};
