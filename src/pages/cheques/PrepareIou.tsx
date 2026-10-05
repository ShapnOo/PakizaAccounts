import React from 'react';
import { ChequePrepareForm } from '../../components/cheques/ChequePrepareForm';

export const PrepareIouPage: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-4">
      <ChequePrepareForm sourceType="iou" />
    </div>
  );
};

export default PrepareIouPage;
