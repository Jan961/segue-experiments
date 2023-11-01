import { userService } from './user.service';
import { func } from 'prop-types';
import axios from 'axios';

export const loggingService = {
  logError,
  logAction,
};

function logAction(action, details) {
  let data = {
    UserID: 0, // This is a "system user"
    Action: action,
    Detail: details,
  };
}

async function logError(error) {
  /**
   await axios.post('/api/log', {
        UserID: 0, // This is a "system user"
        Action: "Error",
        Detail: error
    }).then(axiosResponce => axiosResponce)
     */
}

function getErrorLogCount() {}

function getErrorLog(id) {}

function getErrorLogsByDateRange(fromDate, toDate) {}

function getUserActions(userID) {}

function getUserActionByDateRange(UserId, DateFrom, DateTo) {}
