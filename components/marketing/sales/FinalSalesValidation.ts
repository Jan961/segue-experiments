import { object, mixed } from 'yup';

const schema = object().shape({
  Seats: mixed()
    .test('Seats', 'Warning: Seats sold is greater than 100 and value increased is greater than 15%', function () {
      let { Seats: currentWeekSalesSeats, PreviousSeats: previousWeekSalesSeats } = this.parent;
      currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0;
      previousWeekSalesSeats = parseInt(previousWeekSalesSeats, 10) || 0;
      const seatsPercentageIncrease = (currentWeekSalesSeats - previousWeekSalesSeats) / (previousWeekSalesSeats || 1);
      if (currentWeekSalesSeats >= 100 && seatsPercentageIncrease > 0.15) {
        return false;
      }
      return true;
    })
    .test('Seats', 'Warning: Seats sold is less than 100 and value increased is greater than 50%', function () {
      let { Seats: currentWeekSalesSeats, PreviousSeats: previousWeekSalesSeats } = this.parent;
      currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0;
      previousWeekSalesSeats = parseInt(previousWeekSalesSeats, 10) || 0;
      const seatsPercentageIncrease = (currentWeekSalesSeats - previousWeekSalesSeats) / (previousWeekSalesSeats || 1);
      if (currentWeekSalesSeats < 100 && seatsPercentageIncrease > 0.5) {
        return false;
      }
      return true;
    })
    .test('Seats', 'Warning: Seats sold cannot be less than previous week', function () {
      let { Seats: currentWeekSalesSeats, PreviousSeats: previousWeekSalesSeats } = this.parent;
      currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0;
      previousWeekSalesSeats = parseInt(previousWeekSalesSeats, 10) || 0;
      if (currentWeekSalesSeats < previousWeekSalesSeats) {
        return false;
      }
      return true;
    }),
  Value: mixed()
    .test('Value', 'Warning: Seats sold is less than 100 and value increased is greater than 50%', function () {
      let {
        Seats: currentWeekSalesSeats,
        Value: currentWeekSalesValue,
        PreviousValue: previousWeekSalesValue,
      } = this.parent;
      currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0;
      currentWeekSalesValue = parseInt(currentWeekSalesValue, 10) || 0;
      previousWeekSalesValue = parseInt(previousWeekSalesValue, 10) || 0;
      const valuePercentageIncrease = (currentWeekSalesValue - previousWeekSalesValue) / (previousWeekSalesValue || 1);
      if (currentWeekSalesSeats < 100 && valuePercentageIncrease > 0.5) {
        return false;
      }
      return true;
    })
    .test('Value', 'Warning: Seats sold is greater than 100 and value increased is greater than 15%', function () {
      let {
        Seats: currentWeekSalesSeats,
        Value: currentWeekSalesValue,
        PreviousValue: previousWeekSalesValue,
      } = this.parent;
      currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0;
      currentWeekSalesValue = parseInt(currentWeekSalesValue, 10) || 0;
      previousWeekSalesValue = parseInt(previousWeekSalesValue, 10) || 0;
      const valuePercentageIncrease = (currentWeekSalesValue - previousWeekSalesValue) / (previousWeekSalesValue || 1);
      if (currentWeekSalesSeats >= 100 && valuePercentageIncrease > 0.15) {
        return false;
      }
      return true;
    })
    .test('Value', 'Warning: Sold value cannot be less than previous week', function () {
      let {
        // Seats: currentWeekSalesSeats,
        Value: currentWeekSalesValue,
        PreviousValue: previousWeekSalesValue,
      } = this.parent;
      currentWeekSalesValue = parseInt(currentWeekSalesValue, 10) || 0;
      previousWeekSalesValue = parseInt(previousWeekSalesValue, 10) || 0;
      if (currentWeekSalesValue < previousWeekSalesValue) {
        return false;
      }
      return true;
    }),

  SchoolSeats: mixed()
    .test('SchoolSeats', 'Warning: School seats count cannot be greater than 15% from previous week.', function () {
      let {
        SchoolSeats: currentWeekSchoolSeats,
        PreviousSchoolSeats: previousWeekSchoolSeats,
        isPantomime,
      } = this.parent;
      if (!isPantomime) return true;
      currentWeekSchoolSeats = parseInt(currentWeekSchoolSeats, 10) || 0;
      previousWeekSchoolSeats = parseInt(previousWeekSchoolSeats, 10) || 0;
      const seatsPercentageIncrease =
        (currentWeekSchoolSeats - previousWeekSchoolSeats) / (previousWeekSchoolSeats || 1);
      if (seatsPercentageIncrease > 0.15) {
        return false;
      }
      return true;
    })
    .test('SchoolSeats', 'Warning: School seats cannot be less than previous week.', function () {
      let {
        SchoolSeats: currentWeekSchoolSeats,
        PreviousSchoolSeats: previousWeekSchoolSeats,
        isPantomime,
      } = this.parent;
      if (!isPantomime) return true;
      currentWeekSchoolSeats = parseInt(currentWeekSchoolSeats, 10) || 0;
      previousWeekSchoolSeats = parseInt(previousWeekSchoolSeats, 10) || 0;
      if (currentWeekSchoolSeats < previousWeekSchoolSeats) {
        return false;
      }
      return true;
    }),
  SchoolValue: mixed()
    .test('SchoolValue', 'Warning: Schools value cannot be greater than 15% from previous week.', function () {
      let {
        SchoolValue: currentWeekSchoolValue,
        PreviousSchoolValue: previousWeekSchoolValue,
        isPantomime,
      } = this.parent;
      if (!isPantomime) return true;
      currentWeekSchoolValue = parseInt(currentWeekSchoolValue, 10) || 0;
      previousWeekSchoolValue = parseInt(previousWeekSchoolValue, 10) || 0;
      const valuePercentageIncrease =
        (currentWeekSchoolValue - previousWeekSchoolValue) / (previousWeekSchoolValue || 1);
      if (valuePercentageIncrease > 0.15) {
        return false;
      }
      return true;
    })
    .test('SchoolValue', 'Warning: Schools value less than previous week.', function () {
      let {
        SchoolValue: currentWeekSchoolValue,
        PreviousSchoolValue: previousWeekSchoolValue,
        isPantomime,
      } = this.parent;
      if (!isPantomime) return true;
      currentWeekSchoolValue = parseInt(currentWeekSchoolValue, 10) || 0;
      previousWeekSchoolValue = parseInt(previousWeekSchoolValue, 10) || 0;
      if (currentWeekSchoolValue < previousWeekSchoolValue) {
        return false;
      }
      return true;
    }),
});

export default schema;
