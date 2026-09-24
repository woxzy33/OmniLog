import React from 'react';
import { BodyVisualizer } from '@plexapro/react-body-highlighter';

export default function MuscleHeatmapTest() {
  return <BodyVisualizer frontBodyPart={[{ name: 'Test', muscles: ['chest'], color: 'red' }]} showExtremities={true} />
}
