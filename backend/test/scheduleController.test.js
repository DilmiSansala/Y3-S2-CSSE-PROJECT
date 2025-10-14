const express = require('express');
const request = require('supertest');
const scheduleController = require('../controllers/scheduleController');
const ScheduleRepository = require('../repositories/ScheduleRepository');
const WasteRequest = require('../models/WasteRequest');
const ScheduleFactory = require('../factories/ScheduleFactory');
const ScheduleService = require('../services/ScheduleService');

// Mock dependencies
jest.mock('../repositories/ScheduleRepository');
jest.mock('../models/WasteRequest');
jest.mock('../factories/ScheduleFactory');
jest.mock('../services/ScheduleService');

// Set up a mock Express app
const app = express();
app.use(express.json());

// Routes to test
app.post('/schedules', scheduleController.createSchedule);
app.get('/schedules/:collectorId', scheduleController.getCollectorSchedules);
app.patch('/schedules/:scheduleId/accept', scheduleController.updateScheduleStatus);
app.patch('/schedules/:scheduleId/cancel', scheduleController.cancelSchedule);

describe('Schedule Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /schedules', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/schedules').send({
        collectorId: '1',
        centerId: '',
        vehicleId: '3',
        date: '2024-10-01',
        time: '09:00 AM',
        selectedRequests: ['req1', 'req2'],
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'All fields and selected requests are required.',
      });
    });


  });
 

  describe('PATCH /schedules/:scheduleId/accept', () => {
    it('should update the schedule status to accepted', async () => {
      const mockSchedule = {
        _id: 'schedule1',
        collector: '1',
        center: '2',
        vehicle: '3',
        date: '2024-10-01',
        time: '09:00 AM',
        status: 'accepted',
      };

      ScheduleRepository.updateById.mockResolvedValue(mockSchedule);

      const response = await request(app)
        .patch('/schedules/schedule1/accept')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Schedule accepted.',
        schedule: mockSchedule,
      });
    });
  });

  describe('PATCH /schedules/:scheduleId/cancel', () => {
    it('should update the schedule status to canceled', async () => {
      const mockSchedule = {
        _id: 'schedule1',
        collector: '1',
        center: '2',
        vehicle: '3',
        date: '2024-10-01',
        time: '09:00 AM',
        status: 'canceled',
      };

      ScheduleRepository.updateById.mockResolvedValue(mockSchedule);

      const response = await request(app)
        .patch('/schedules/schedule1/cancel')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Schedule canceled.',
        schedule: mockSchedule,
      });
    });
  });
});
