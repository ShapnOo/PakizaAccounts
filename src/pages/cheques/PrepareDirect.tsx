import React from 'react';
import { ChequeTabs } from '../../components/cheques/ChequeTabs';
import { ChequePrepareForm } from '../../components/cheques/ChequePrepareForm';

export const PrepareDirectPage: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-4">
      <ChequeTabs />
      <ChequePrepareForm sourceType="direct" />
    </div>
  );
};

export default PrepareDirectPage;
