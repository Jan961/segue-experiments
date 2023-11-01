import * as React from 'react';

import { Show, Tour } from '../../interfaces';

type ListDetailProps = {
  item: Tour;
  show: Show;
};

const ListDetail = ({ item: tour }: ListDetailProps) => (
  <div>
    <h1>Detail for {tour.TourId}</h1>
    <p>ID: {tour.TourId}</p>
  </div>
);

export default ListDetail;
