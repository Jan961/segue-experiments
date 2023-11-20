import { object, mixed } from 'yup';

const schema = object().shape({
  Seats: mixed().test('Seats', 'Warning: Seats sold is greater than 100 and value increased is greater than 15%', function () {
    let {
      Seats: currentWeekSalesSeats,
      PreviousSeats: previousWeekSalesSeats
    } = this.parent
    currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0
    previousWeekSalesSeats = parseInt(previousWeekSalesSeats, 10) || 0
    const seatsPercentageIncrease =
        (currentWeekSalesSeats - previousWeekSalesSeats) /
        (previousWeekSalesSeats || 1)
    if (currentWeekSalesSeats >= 100 && seatsPercentageIncrease > 0.15) {
      return false
    }
    return true
  }).test('Seats', 'Warning: Seats sold is less than 100 and value increased is greater than 50%', function () {
    let {
      Seats: currentWeekSalesSeats,
      PreviousSeats: previousWeekSalesSeats
    } = this.parent
    currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0
    previousWeekSalesSeats = parseInt(previousWeekSalesSeats, 10) || 0
    const seatsPercentageIncrease =
        (currentWeekSalesSeats - previousWeekSalesSeats) /
        (previousWeekSalesSeats || 1)
    if (
      (currentWeekSalesSeats < 100 && seatsPercentageIncrease > 0.5)
    ) {
      return false;
    }
    return true;
  }).test('Seats', 'Warning: Seats sold cannot be less than previous week', function () {
    let {
      Seats: currentWeekSalesSeats,
      PreviousSeats: previousWeekSalesSeats
    } = this.parent
    currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0
    previousWeekSalesSeats = parseInt(previousWeekSalesSeats, 10) || 0
    if (currentWeekSalesSeats < previousWeekSalesSeats) {
      return false;
    }
    return true;
  }),
  Value: mixed().test('Value', 'Warning: Seats sold is less than 100 and value increased is greater than 50%', function () {
    let {
      Seats: currentWeekSalesSeats,
      Value: currentWeekSalesValue,
      PreviousValue: previousWeekSalesValue
    } = this.parent
    currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0
    currentWeekSalesValue = parseInt(currentWeekSalesValue, 10) || 0
    previousWeekSalesValue = parseInt(previousWeekSalesValue, 10) || 0
    const valuePercentageIncrease =
        (currentWeekSalesValue - previousWeekSalesValue) /
        (previousWeekSalesValue || 1)
    if (
      (currentWeekSalesSeats < 100 && valuePercentageIncrease > 0.5)
    ) {
      return false
    }
    return true
  }).test('Value', 'Warning: Seats sold is greater than 100 and value increased is greater than 15%', function () {
    let {
      Seats: currentWeekSalesSeats,
      Value: currentWeekSalesValue,
      PreviousValue: previousWeekSalesValue,
    } = this.parent;
    currentWeekSalesSeats = parseInt(currentWeekSalesSeats, 10) || 0;
    currentWeekSalesValue = parseInt(currentWeekSalesValue, 10) || 0;
    previousWeekSalesValue = parseInt(previousWeekSalesValue, 10) || 0;
    const valuePercentageIncrease = (currentWeekSalesValue - previousWeekSalesValue) / (previousWeekSalesValue || 1);
    if (
      (currentWeekSalesSeats >= 100 && valuePercentageIncrease > 0.15)
    ) {
      return false;
    }
    return true;
  }).test('Value', 'Warning: Sold value cannot be less than previous week', function () {
    let {
      Seats: currentWeekSalesSeats,
      Value: currentWeekSalesValue,
      PreviousValue: previousWeekSalesValue,
    } = this.parent;
    currentWeekSalesValue = parseInt(currentWeekSalesValue, 10) || 0;
    previousWeekSalesValue = parseInt(previousWeekSalesValue, 10) || 0;
    if (currentWeekSalesValue<previousWeekSalesValue) {
      return false;
    }
    return true;
  }),

  ReservedSeats: mixed().test(
    'ReservedSeats',
    'Warning: Reserved seats count cannot be greater than 15% from previous week.',
    function () {
      let { ReservedSeats: currentWeekReservationSeats, PreviousReservedSeats: previousWeekReservationSeats } =
        this.parent;
      currentWeekReservationSeats = parseInt(currentWeekReservationSeats, 10) || 0;
      previousWeekReservationSeats = parseInt(previousWeekReservationSeats, 10) || 0;
      const seatsPercentageIncrease =
        (currentWeekReservationSeats - previousWeekReservationSeats) / (previousWeekReservationSeats || 1);
      if (seatsPercentageIncrease > 0.15) {
        return false;
      }
      return true;
    },
  ).test(
    'ReservedSeats',
    'Warning: Reserved seats cannot be less than previous week.',
    function () {
      let { ReservedSeats: currentWeekReservationSeats, PreviousReservedSeats: previousWeekReservationSeats } =
        this.parent;
      currentWeekReservationSeats = parseInt(currentWeekReservationSeats, 10) || 0;
      previousWeekReservationSeats = parseInt(previousWeekReservationSeats, 10) || 0;
      if (currentWeekReservationSeats<previousWeekReservationSeats) {
        return false;
      }
      return true;
    },
  ),
  ReservedValue: mixed().test(
    'ReservedValue',
    'Warning: Reservations value cannot be greater than 15% from previous week.',
    function () {
      let { ReservedValue: currentWeekReservationValue, PreviousReservedValue: previousWeekReservationValue } =
        this.parent;
      currentWeekReservationValue = parseInt(currentWeekReservationValue, 10) || 0;
      previousWeekReservationValue = parseInt(previousWeekReservationValue, 10) || 0;
      const valuePercentageIncrease =
        (currentWeekReservationValue - previousWeekReservationValue) / (previousWeekReservationValue || 1);
      if (valuePercentageIncrease > 0.15) {
        return false;
      }
      return true;
    },
  ).test(
    'ReservedValue',
    'Warning: Reservations value less than previous week.',
    function () {
      let { ReservedValue: currentWeekReservationValue, PreviousReservedValue: previousWeekReservationValue } =
        this.parent;
      currentWeekReservationValue = parseInt(currentWeekReservationValue, 10) || 0;
      previousWeekReservationValue = parseInt(previousWeekReservationValue, 10) || 0;
      if (currentWeekReservationValue<previousWeekReservationValue) {
        return false;
      }
      return true;
    },
  ),
});

export default schema;
