const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    timestamp: { type: Date, required: true,default:Date.now,expires:3600 },
    userId: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    avatar:{type:String,required:true},
    icon:{type:String,required:true},

  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000)
    },
    timeseries: {
      timeField: 'timestamp',
      metaField: 'userId',
      granularity: 'hours',
    }
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
